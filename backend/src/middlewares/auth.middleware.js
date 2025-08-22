import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export async function checkAuth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token =
      req.cookies?.access_token ||
      (authHeader &&
        authHeader.startsWith("Bearer") &&
        authHeader.split(" ")[1]);
    if (!token)
      throw new ApiError(401, "Unauthorized request or token is missing.");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decodedToken) throw new ApiError(400, "Not a valid token.");

    const id = decodedToken.id;
    const user = await User.findById(id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "Unauthorized or invalid token.");
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
