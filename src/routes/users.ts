import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { UserValidation } from "../validation/users-validation";

import { errorResponse, successResponse } from "../utils/response";

import { createJwtPayload, generateTokens } from "../utils/jwt-utils";
import { UserService } from "../service/user-service";
import { verify as argon2Verify } from "argon2";
import { prisma } from "../../prisma/client";
import { nanoid } from "nanoid";
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

      const accessTokenExpirationTime = Math.floor(Date.now() / 1000) + 1 * 60;
      const jwtPayload = createJwtPayload(user, accessTokenExpirationTime);
      const { accessToken, refreshToken } = await generateTokens(jwtPayload);

      // Create Session
      await prisma.session.create({
        data: {
          sessionToken: nanoid(),
          accessToken,
          refreshToken,
          accessTokenExpires: new Date(accessTokenExpirationTime * 1000),
          refreshTokenExpires: new Date(
            (accessTokenExpirationTime + 7 * 24 * 60 * 60) * 1000
          ),
          userId: user.id,
        },
      });

      const userData = {
        user,
        auth: {
          accessToken,
          refreshToken,
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
// TODO Access Token harus diperbarui berdasarkan Refresh Token
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

  const isPasswordValid = await argon2Verify(
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

  const accessTokenExpirationTime = Math.floor(Date.now() / 1000) + 30 * 60;
  const jwtPayload = createJwtPayload(user, accessTokenExpirationTime);
  const { accessToken, refreshToken } = await generateTokens(jwtPayload);

  const userData = {
    user: {
      id: user.id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    },
    auth: {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
    },
  };
  const loginResponse = successResponse<typeof userData>({
    message: "Login success",
    data: userData,
  });

  return c.json(loginResponse);
});

route.post("/refresh-token", async (c) => {
  const refreshToken = await c.req.json();

  const session = await prisma.session.findUnique({
    where: {
      refreshToken,
    },
  });

  // const {accessToken} = generateAccessToken(session)

  // return c.json({
  //   accessToken:
  // })
});

export default route;
