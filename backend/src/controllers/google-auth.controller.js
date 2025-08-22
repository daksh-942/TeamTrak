import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleAuth(req, res) {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    const firstname = name.split(" ")?.[0];
    const lastname = name.split(" ")?.[1];
    const avatar = firstname[0].toUpperCase() + lastname[0].toUpperCase();
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstname,
        lastname,
        email,
        avatar,
        isGoogleUser: true,
      });
    }
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    if (!accessToken || !refreshToken) {
      await User.findByIdAndDelete(newUser._id);
      throw new ApiError(
        500,
        "RefreshToken or AccessToken could not be generated."
      );
    }

    user.refreshToken = refreshToken;
    await user.save();

    return res
      .status(201)
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        secure: true, // required in production (HTTPS)
        sameSite: "None", // needed for cross-site cookies
      })
      .cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        secure: true, // required in production (HTTPS)
        sameSite: "None", // needed for cross-site cookies
      })
      .json({
        success: true,
        user: {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          avatar: user.avatar,
        },
      });
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
