import { type User } from "@prisma/client";

import { createJWT, validateJWT } from "oslo/jwt";
import { TimeSpan } from "oslo";

// Oslo

const secretAccessToken = process.env.ACCESS_TOKEN_SECRET_KEY;
const secretRefreshToken = process.env.REFRESH_TOKEN_SECRET_KEY;

const secretAccessTokenBuffer = new TextEncoder().encode(secretAccessToken);
const secretRefreshTokenBuffer = new TextEncoder().encode(secretRefreshToken);

export const generateAccessToken = async (user: User) => {
  const extendedPayloadClaims = {
    email: user.email,
    role: user.role,
  };

  const accessToken = await createJWT(
    "HS256",
    secretAccessTokenBuffer,
    extendedPayloadClaims,
    {
      expiresIn: new TimeSpan(15, "m"),
      issuer: process.env.BACKEND_DEPLOYMENT_URL,
      subject: user.id,
      audiences: [process.env.FRONTEND_DEPLOYMENT_URL || ""],
      includeIssuedTimestamp: true,
      notBefore: new Date(),
    }
  );

  return accessToken;
};
export const generateRefreshToken = async (user: User) => {
  const refreshToken = await createJWT(
    "HS256",
    secretRefreshTokenBuffer,
    {},
    {
      expiresIn: new TimeSpan(30, "d"),
      issuer: process.env.BACKEND_DEPLOYMENT_URL,
      subject: user.id,
      audiences: [process.env.FRONTEND_DEPLOYMENT_URL || ""],
      includeIssuedTimestamp: true,
      notBefore: new Date(),
    }
  );

  return refreshToken;
};

export const verifyJwtToken = (token: string, secret: string) => {
  try {
    const secretBuffer = new TextEncoder().encode(secret);
    const decodedToken = validateJWT("HS256", secretBuffer, token);

    return decodedToken;
  } catch (error) {
    throw new Error("Invalid Token");
  }
};
