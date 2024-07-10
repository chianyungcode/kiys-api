import { type User } from "@prisma/client";
import { sign as jwtSign, verify as jwtVerify } from "hono/jwt";
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
    exp: expireTime,
    iat: Math.floor(Date.now() / 1000),
    jti: nanoid(),
    email: user.email,
    roles: user.role.toLowerCase(),
  };

  return jwtPayload;
};

export const generateTokens = async (payload: GenerateJwtTokenType) => {
  if (
    !process.env.ACCESS_TOKEN_SECRET_KEY ||
    !process.env.REFRESH_TOKEN_SECRET_KEY
  ) {
    throw new Error(
      "Access token or refresh token secret key is missing. Please check your environment configuration."
    );
  }

  // Generate Access Token
  const accessToken = await jwtSign(
    payload,
    process.env.ACCESS_TOKEN_SECRET_KEY
  );

  // Generate Refresh Token
  const refreshTokenPayload = {
    sub: payload.sub,
    jti: payload.jti,
    exp: payload.exp + 7 * 24 * 60 * 60,
  };
  const refreshToken = await jwtSign(
    refreshTokenPayload,
    process.env.REFRESH_TOKEN_SECRET_KEY
  );

  return {
    accessToken,
    refreshToken,
  };
};

// export const generateAccessToken = async (refreshToken: string) => {
//   const payload;
// };

export const verifyJwtToken = async (token: string, secretKey: string) => {
  try {
    const payload = await jwtVerify(token, secretKey);

    return payload;
  } catch (error) {
    throw new Error("Invalid Token");
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
};
