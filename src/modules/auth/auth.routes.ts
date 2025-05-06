import { Router } from "express";
import auth from "../../middlewares/auth";
import { requestValidator } from "../../middlewares/requestValidator";
import {
  changePasswordController,
  forgetPasswordController,
  loginController,
  logoutController,
  refreshController,
  registerUserController,
  resetPasswordController,
} from "./auth.controller";
import { createUserValidation, loginValidation } from "./auth.validaton";

export const authRoutes: Router = Router();

// main authentication
authRoutes.post(
  "/signup",
  requestValidator(createUserValidation),
  registerUserController
);

authRoutes.post("/login", requestValidator(loginValidation), loginController);
// authRoutes.get(
//   '/me',
//   auth('admin','subadmin','user'),
//   getMe,
// );
authRoutes.get("/refresh", refreshController);

authRoutes.post("/forgot-password", forgetPasswordController);
authRoutes.patch("/reset-password", resetPasswordController);
authRoutes.patch(
  "/change-password",
  auth("user", "admin", "subadmin"),
  changePasswordController
);

authRoutes.get("/logout", logoutController);
