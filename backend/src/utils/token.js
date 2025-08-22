import jwt from "jsonwebtoken";

export async function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

export async function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}
