// server/controllers/googleLogin.easy.js

import { OAuth2Client } from "google-auth-library";
import UserModel from "../models/user.model.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import genertedRefreshToken from "../utils/generatedRefreshToken.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleEasyLogin(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Missing Google credential",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Google account has no email",
      });
    }

    let user = await UserModel.findOne({
      $or: [{ email }, { google_id: sub }],
    });

    // 🆕 CREATE USER IF NOT EXISTS
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        avatar: picture,
        google_id: sub,
        verify_email: true,
        role: "USER",
        language: "en",
      });
    }

    // 🔄 LINK GOOGLE ID IF EMAIL EXISTS
    if (!user.google_id) {
      user.google_id = sub;
      user.verify_email = true;
    }

    // 🔐 TOKENS
    const accessToken = await generatedAccessToken(user._id);
    const refreshToken = await genertedRefreshToken(user._id);

    // 🧠 LOGIN HISTORY + REFRESH TOKEN
    user.last_login_date = new Date();
    user.refresh_token = refreshToken;
    user.login_history.push({
      login_at: new Date(),
      ip_address:
        req.headers["x-forwarded-for"] || req.socket.remoteAddress,
      user_agent: req.headers["user-agent"] || "",
    });

    await user.save();

    // 🍪 COOKIES
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      success: true,
      message: "Google login successful",
      data: {
        accesstoken: accessToken,
        refreshToken,
        language: user.language,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({
      success: false,
      message: "Google login failed",
    });
  }
}
