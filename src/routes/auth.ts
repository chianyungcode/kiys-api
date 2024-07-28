import { Hono } from "hono";
import { errorResponse, successResponse } from "../utils/response";
import { UserService } from "../service/user-service";
import { zValidator } from "@hono/zod-validator";
import { UserValidation } from "../validation/user-validation";
import {
  AccessTokenPayloadType,
  RefreshTokenPayloadType,
  createJwtPayload,
  generateAccessToken,
  generateRefreshToken,
  verifyJwtToken,
} from "../utils/jwt-utils";
import { nanoid } from "nanoid";
import { prisma } from "../../prisma/client";
import { argon2id } from "../lib/oslo";

import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from "hono/cookie";

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

      // Token expiration time
      const accessTokenExpirationTime =
        Math.floor(Date.now() / 1000) +
        60 * Number(process.env.ACCESS_TOKEN_EXPIRATION_MINUTE || "15"); // Default 15 Minute
      const refreshTokenExpirationTime =
        Math.floor(Date.now() / 1000) +
        60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_EXPIRATION_DAY || "30"); // Default 30 days

      // Create payload
      const accessTokenPayload = createJwtPayload(
        user,
        accessTokenExpirationTime
      );
      const refreshTokenPayload = createJwtPayload(
        user,
        refreshTokenExpirationTime
      );

      // Generate tokens
      const accessToken = await generateAccessToken(accessTokenPayload);
      const refreshToken = await generateRefreshToken(refreshTokenPayload);

      setCookie(c, "refresh-token", refreshToken, {
        path: "/",
        secure: true,
        httpOnly: true,
        expires: new Date(refreshTokenExpirationTime * 1000), // Set cookie expiration to match refresh token expiration
        sameSite: "Strict",
      });

      // Create Session
      // TODO: Cari cara bagaimana mengakses ip address dengan hono framework, meskipun sebenarnya ini sudah betul dalam kebanyakan kasus memang ip address dibawah pada header request
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
          token: accessToken,
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
  console.log(process.env.NODE_ENV);

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

  const accessTokenExpirationTime =
    Math.floor(Date.now() / 1000) +
    60 * Number(process.env.ACCESS_TOKEN_EXPIRATION_MINUTE || "15"); // Default 15 Minute
  const refreshTokenExpirationTime =
    Math.floor(Date.now() / 1000) +
    60 * 60 * 24 * Number(process.env.REFRESH_TOKEN_EXPIRATION_DAY || "30"); // Default 30 days

  // Create payload
  const accessTokenPayload = createJwtPayload(user, accessTokenExpirationTime);
  const refreshTokenPayload = createJwtPayload(
    user,
    refreshTokenExpirationTime
  );

  // Generate tokens
  const accessToken = await generateAccessToken(accessTokenPayload);
  const refreshToken = await generateRefreshToken(refreshTokenPayload);

  // Set cookie from server
  setCookie(c, "refresh-token", refreshToken, {
    path: "/",
    secure: process.env.NODE_ENV === "development" ? false : true,
    httpOnly: true,
    expires: new Date(refreshTokenExpirationTime * 1000), // Set cookie expiration to match refresh token expiration
    sameSite: "Strict",
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

route.post("/refresh", async (c) => {
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
    const refreshToken = getCookie(c, "refresh-token");

    if (!refreshToken) {
      return c.json(
        errorResponse({
          message: "Access Denied. No Refresh Token provided",
          errors: { token: "Missing refresh token" },
        }),
        401
      );
    }

    const payload = (await verifyJwtToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    )) as RefreshTokenPayloadType;

    const user = await UserService.findUserByEmail(payload.email);

    if (!user) {
      return c.json(
        errorResponse({
          message: "User not found",
          errors: { email: "User associated with this token not found" },
        }),
        404
      );
    }

    const accessTokenExpirationTime =
      Math.floor(Date.now() / 1000) +
      60 * Number(process.env.ACCESS_TOKEN_EXPIRATION_MINUTE || "15");

    const newAccessTokenPayload = createJwtPayload(
      user,
      accessTokenExpirationTime
    );

    const accessToken = await generateAccessToken(newAccessTokenPayload);

    return c.json(
      successResponse({
        message: "Token refreshed successfully",
        data: {
          token: accessToken,
          tokenType: "Bearer",
          expiresIn: accessTokenExpirationTime - Math.floor(Date.now() / 1000),
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
