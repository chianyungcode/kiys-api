import { createFactory } from "hono/factory";
import { verifyJwtToken } from "../utils/jwt-utils";
import { errorResponse } from "../utils/response";

const factory = createFactory();

// Middleware for protected route, examples create products, delete products etc
export const authMiddleware = factory.createMiddleware(async (c, next) => {
  const authenticationHeader = c.req.header("Authorization");
  const accessToken =
    authenticationHeader && authenticationHeader.split(" ")[1];

  if (!accessToken) {
    return c.json(
      errorResponse({
        errors: "unauthorized",
        message: "Unauthorized",
      }),
      401
    );
  }

  if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
    throw new Error("ACCESS_TOKEN_SECRET_KEY is missing");
  }

  try {
    await verifyJwtToken(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
  } catch (error) {
    return c.json(
      errorResponse({
        errors: "invalid_access_token",
        message: "Invalid access token",
      }),
      401
    );
  }

  await next();
});

const isAccessTokenNotExpired = factory.createMiddleware(async (c, next) => {
  const authenticationHeader = c.req.header("Authorization");
  const accessToken =
    authenticationHeader && authenticationHeader.split(" ")[1];

  if (!accessToken) {
    return c.json(
      errorResponse({
        errors: "accessToken not found",
        message: "Access Token is required",
      })
    );
  }

  if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
    throw new Error("ACCESS_TOKEN_SECRET_KEY is missing");
  }

  const payload = verifyJwtToken(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET_KEY
  );

  if (!payload) {
    return c.json(
      errorResponse({
        message: "Access Token is Expired",
        errors: "accessToken is Expired",
      })
    );

    // const getNewAccessToken = genereateNewAccessToken();
  }

  await next();
});
