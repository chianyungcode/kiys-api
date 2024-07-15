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
// ! Still have error in this endpoint need to FIX
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

      const accessTokenExpirationTime =
        Math.floor(Date.now() / 1000) +
        60 * parseInt(process.env.ACCESS_TOKEN_EXPIRATION_MINUTE || "15"); // Default 15 Minute
      const refreshTokenExpirationTime =
        Math.floor(Date.now() / 1000) +
        60 *
          60 *
          24 *
          parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAY || "30"); // Default 30 days

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
      await prisma.session.create({
        data: {
          sessionToken: nanoid(),
          accessToken,
          refreshToken,
          accessTokenExpires: new Date(accessTokenExpirationTime * 1000),
          refreshTokenExpires: new Date(refreshTokenExpirationTime * 1000),
          userId: user.id,
        },
      });

      const userData = {
        user,
        auth: {
          accessToken,
          tokenType: "Bearer",
        },
      };

      const usersResponse = successResponse<typeof userData>({
        data: userData,
        message: "User created",
      });

      return c.json(usersResponse, 201);
    } catch (error) {
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

  const accessTokenExpirationTime =
    Math.floor(Date.now() / 1000) +
    60 * parseInt(process.env.ACCESS_TOKEN_EXPIRATION_MINUTE || "15"); // Default 15 Minute
  const refreshTokenExpirationTime =
    Math.floor(Date.now() / 1000) +
    60 * 60 * 24 * parseInt(process.env.REFRESH_TOKEN_EXPIRATION_DAY || "30"); // Default 30 days

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
    secure: true,
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

// Refresh Token Endpoint
route.post("/refresh-token", async (c) => {
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

  if (!process.env.REFRESH_TOKEN_SECRET_KEY) {
    throw new Error("REFRESH_TOKEN_SECRET_KEY is missing");
  }

  try {
    if (typeof refreshToken !== "string") {
      throw new Error("Invalid refresh token format");
    }

    const payload = (await verifyJwtToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    )) as RefreshTokenPayloadType;

    const accessTokenExpirationTime =
      Math.floor(Date.now() / 1000) +
      60 * parseInt(process.env.ACCESS_TOKEN_EXPIRATION_MINUTE!);

    const user = await UserService.findUserByEmail(payload.email);

    if (!user) {
      return c.json(
        errorResponse({
          message: "User not found",
          errors: {
            email: "User with this email not found",
          },
        }),
        401
      );
    }

    const newAccessTokenPayload = createJwtPayload(
      user,
      accessTokenExpirationTime
    );

    const accessToken = await generateAccessToken(newAccessTokenPayload);

    const refreshTokenResponse = successResponse({
      message: "Token refreshed successfully",
      data: {
        accessToken,
        tokenType: "Bearer",
      },
    });

    return c.json(refreshTokenResponse);
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
