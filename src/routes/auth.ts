import { Hono } from "hono";
import { errorResponse, successResponse } from "../utils/response";
import { UserService } from "../service/user-service";
import { zValidator } from "@hono/zod-validator";
import { UserValidation } from "../validation/user-validation";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJwtToken,
} from "../utils/jwt-utils";
import { prisma } from "../../prisma/client";
import { argon2id } from "../lib/oslo";

import { getCookie, setCookie } from "hono/cookie";

const route = new Hono();

// Register User
route.post(
  "/register",
  zValidator("json", UserValidation.register),
  async (c) => {
    try {
      const validatedUserData = c.req.valid("json");

      // Check if user exist
      const userExists = await UserService.findUserByEmail(
        validatedUserData.email
      );
      if (userExists) {
        const userExistsError = errorResponse({
          message: "User already exists",
          errors: {
            email: "Email already used",
          },
        });
        return c.json(userExistsError, 409);
      }

      const user = await UserService.register(validatedUserData);

      // Generate tokens
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);

      setCookie(c, "refreshToken", refreshToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set cookie expiration to 30 days
        sameSite: "Strict",
      });

      // Create Session
      // TODO: get ip address from http request header cloudflare
      await prisma.session.create({
        data: {
          ipAddress:
            c.req.header("X-Forwarded-For") ||
            c.req.header("Remote-Addr") ||
            "",
          userAgent: c.req.header("User-Agent") || "",
          userId: user.id,
        },
      });

      const userData = {
        user,
        auth: {
          accessToken: accessToken,
          tokenType: "Bearer",
        },
      };

      const usersResponse = successResponse<typeof userData>({
        data: userData,
        message: "User created",
      });

      return c.json(usersResponse, 201);
    } catch (error) {
      console.error("Error during registration:", error);
      return c.json(
        errorResponse({ message: "Internal server error", errors: error }),
        500
      );
    }
  }
);

// Login User
route.post("/login", zValidator("json", UserValidation.login), async (c) => {
  const validatedUserLogin = c.req.valid("json");

  const user = await UserService.findUserByEmail(validatedUserLogin.email);
  if (!user) {
    const userNotFoundError = errorResponse({
      message: "User not found",
      errors: {
        email: "User with this email not found",
      },
    });
    return c.json(userNotFoundError, 404);
  }

  const isPasswordValid = await argon2id.verify(
    user.password,
    validatedUserLogin.password
  );

  if (!isPasswordValid) {
    const passwordError = errorResponse({
      message: "Password is incorrect",
      errors: { password: "Password is incorrect" },
    });

    return c.json(passwordError, 401);
  }

  // Generate tokens
  const accessToken = await generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  // Set cookie from server
  setCookie(c, "refreshToken", refreshToken, {
    path: "/",
    // secure: process.env.NODE_ENV === "development" ? false : true,
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set cookie expiration to 30 days
    // sameSite: "Strict",
  });

  const userData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    },
    auth: {
      accessToken,
      tokenType: "Bearer",
    },
  };
  const loginResponse = successResponse<typeof userData>({
    message: "Login success",
    data: userData,
  });

  return c.json(loginResponse);
});

// How to get new access token with refresh token
route.post("/refresh/token", async (c) => {
  if (!process.env.REFRESH_TOKEN_SECRET_KEY) {
    console.error("REFRESH_TOKEN_SECRET_KEY is missing");
    return c.json(
      errorResponse({
        message: "Internal server error",
        errors: { server: "Server configuration error" },
      }),
      500
    );
  }

  try {
    const refreshToken = getCookie(c, "refreshToken");

    if (!refreshToken) {
      return c.json(
        errorResponse({
          message: "Access Denied. No Refresh Token provided",
          errors: { token: "Missing refresh token" },
        }),
        401
      );
    }

    const decodedRefreshToken = await verifyJwtToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY!
    );

    const user = await UserService.getUser(decodedRefreshToken.subject!);

    if (!user) {
      return c.json(
        errorResponse({
          message: "User not found",
          errors: { email: "User associated with this token not found" },
        }),
        404
      );
    }

    const newAccessToken = await generateAccessToken(user);

    return c.json(
      successResponse({
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
          tokenType: "Bearer",
        },
      })
    );
  } catch (error) {
    console.error("Error refreshing token:", error);
    return c.json(
      errorResponse({
        message: "Invalid or expired refresh token",
        errors: { token: "Invalid refresh token" },
      }),
      401
    );
  }
});

export default route;
