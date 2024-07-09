import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { UserValidation } from "../validation/users-validation";

import { errorResponse, successResponse } from "../utils/response";

import { createJwtPayload, generateJwtToken } from "../utils/jwt-utils";
import { UserService } from "../service/user-service";
import { verify as argon2Verify } from "argon2";

const route = new Hono();

// Create User
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
      const expireTime = Math.floor(Date.now() / 1000) + 30 * 60;
      const jwtPayload = createJwtPayload(user, expireTime);
      const token = await generateJwtToken(jwtPayload);

      const customUser = {
        user,
        auth: {
          accessToken: token,
          tokenType: "Bearer",
          expiresIn: expireTime,
        },
      };

      const usersResponse = successResponse<typeof customUser>({
        data: customUser,
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

  const isPasswordMatch = await argon2Verify(
    user.password,
    validatedUserLogin.password
  );

  if (!isPasswordMatch) {
    const passwordError = errorResponse({
      message: "Password is incorrect",
      errors: { password: "Password is incorrect" },
    });

    return c.json(passwordError, 401);
  }

  const expireTime = Math.floor(Date.now() / 1000) + 30 * 60;
  const jwtPayload = createJwtPayload(user, expireTime);
  const token = await generateJwtToken(jwtPayload);

  const customUser = {
    user: {
      id: user.id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
    },
    auth: {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: expireTime,
    },
  };
  const loginResponse = successResponse<typeof customUser>({
    message: "Login success",
    data: customUser,
  });

  return c.json(loginResponse);
});

export default route;
