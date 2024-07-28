import { type User } from "@prisma/client";
import { sign as jwtSign, verify as jwtVerify } from "hono/jwt";
import { nanoid } from "nanoid";

export type AccessTokenPayloadType = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  roles: string;
};

export type RefreshTokenPayloadType = AccessTokenPayloadType;

export const createJwtPayload = (user: User, expireTime: number) => {
  const jwtPayload = {
    iss: process.env.BACKEND_DEPLOYMENT_URL!,
    sub: user.id,
    aud: process.env.FRONTEND_DEPLOYMENT_URL!,
    exp: expireTime,
    iat: Math.floor(Date.now() / 1000),
    jti: nanoid(),
    email: user.email,
    roles: user.role.toLowerCase(),
  };

  return jwtPayload;
};

export const generateAccessToken = (payload: AccessTokenPayloadType) => {
  if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
    throw new Error("Access token secret key is missing");
  }

  const accessToken = jwtSign(payload, process.env.ACCESS_TOKEN_SECRET_KEY);

  return accessToken;
};

export const generateRefreshToken = (payload: RefreshTokenPayloadType) => {
  if (!process.env.REFRESH_TOKEN_SECRET_KEY) {
    throw new Error("Refresh token secret key is missing");
  }

  const refreshToken = jwtSign(payload, process.env.REFRESH_TOKEN_SECRET_KEY);

  return refreshToken;
};

export const verifyJwtToken = (token: string, secretKey: string) => {
  try {
    const payload = jwtVerify(token, secretKey);

    return payload;
  } catch (error) {
    throw new Error("Invalid Token");
  }
};
