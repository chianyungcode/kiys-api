import { type User } from "@prisma/client";
import { sign } from "hono/jwt";
import { nanoid } from "nanoid";

type GenerateJwtTokenType = {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  roles: string;
};

export const createJwtPayload = (user: User, expireTime: number) => {
  const jwtPayload = {
    iss: process.env.BACKEND_DEPLOYMENT_URL!,
    sub: user.id,
    aud: process.env.FRONTEND_DEPLOYMENT_URL!,
    exp: expireTime, // Expiration set to 30 minutes
    iat: Math.floor(Date.now() / 1000),
    jti: nanoid(),
    email: user.email,
    roles: user.role.toLowerCase(),
  };

  return jwtPayload;
};

export const generateJwtToken = async (payload: GenerateJwtTokenType) => {
  if (!process.env.JWT_SECRET_KEY) {
    throw new Error("JWT_SECRET_KEY is missing");
  }

  const token = await sign(payload, process.env.JWT_SECRET_KEY);

  return token;
};

export const verifyJwtToken = async (token: string) => {};
