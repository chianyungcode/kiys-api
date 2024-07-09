import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { UserValidation } from "../validation/users-validation";

import { errorResponse, successResponse } from "../utils/response";

import { createJwtPayload, generateJwtToken } from "../utils/jwt-utils";
import { UserService } from "../service/user-service";

const route = new Hono();

// Create User
route.post("/", zValidator("json", UserValidation.REGISTER), async (c) => {
  try {
    const validatedUserData = c.req.valid("json");

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
});

export default route;
