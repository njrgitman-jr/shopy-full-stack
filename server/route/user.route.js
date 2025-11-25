import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshToken,
  registerUserController,
  resetpassword,
  updateUserDetails,
  uploadAvatar,
  userDetails,
  verifyEmailController,
  verifyForgotPasswordOtp,
} from "../controllers/user.controller.js";

import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import { admin } from "../middleware/admin.js";

//create endpoints for each method in user.controller.js ... then used in summaryApi.js
const userRouter = Router();
userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController); //auth middlewarwe only logged in user can use
userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvatar); //auth middlewarwe only logged in user can use
userRouter.put("/update-user", auth, updateUserDetails);
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.put("/reset-password", resetpassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", auth, userDetails); //'endpoint',exported controller name ..also add auth middleware so that user can access the id from middleware

export default userRouter;

