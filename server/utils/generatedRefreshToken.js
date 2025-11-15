import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const genertedRefreshToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_REFRESH_TOKEN,
    { expiresIn: "7d" }
  );

  const updateRefreshTokenUser = await UserModel.updateOne(
    { _id: userId },    //find the user
    {
      refresh_token: token,   //then update field with the generated refresh token
    }
  );

  return token;
};

export default genertedRefreshToken;


//every time u generate new refresh toke it will be update in the (refresh_token) in the database
//refresh is to increase the life span of access token it is valid for more time 1 day 2days 30 days depending on the
//configuration of the developer who given this
