import type { RequestHandler } from "express";
import httpStatus from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import {
  NODE_ENV,
  access_token,
  access_token_expiry,
  refresh_token,
  refresh_token_expiry,
} from "../../config";
import { CustomError } from "../../errors/CustomError";
import { catchAsync } from "../../utils/catchAsync";
import { genarateToken } from "../../utils/genarateToken";
import { sendResponse } from "../../utils/sendResponse";
import type { IUser } from "../user/user.interface";
import type { ILogin } from "./auth.interface";
import {
  changePasswordService,
  createUserService,
  forgetPasswordService,
  loginService,
  prepareForActivateService,
  refreshTokenService,
  resetPasswordPasswordService,
} from "./auth.service";

export const registerUserController: RequestHandler = catchAsync(
  async (req, res) => {
    const payload: IUser = req.body;

    const { result, token } = await createUserService(payload);

    sendResponse(res, {
      status: httpStatus.CREATED,
      success: true,
      message: "Account created successfully",
      data: result,
      accessToken: token,
    });
  }
);

// Account creation Part  End

/**
 *  === ============= === Login part  === ---- === ===
 */

export const loginController: RequestHandler = catchAsync(async (req, res) => {
  const payload: ILogin = req.body;
  const { refreshToken, accessToken, rest } = await loginService(payload);

  // res.cookie("refreshToken", refreshToken, {
  //   secure: NODE_ENV === "production",
  //   httpOnly: true,
  // });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "logged in successfully",
    accessToken,
    refreshToken,
    data: rest,
  });
});

export const refreshController: RequestHandler = catchAsync(
  async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await refreshTokenService(refreshToken);
    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Access token is retrieved succesfully!",
      accessToken: result,
      refreshToken,
    });
  }
);

/**
 *  === ============= === Password Management  For Reset And Forget  === ---- === ===
 */

export const forgetPasswordController: RequestHandler = catchAsync(
  async (req, res) => {
    const token = await forgetPasswordService(req.body);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Please Check Your Email To Reset Your Password",
      accessToken: token,
    });
  }
);
export const resetPasswordController: RequestHandler = catchAsync(
  async (req, res) => {
    const token = req.query.token as string;
    await resetPasswordPasswordService(token, req.body);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "password Reset Successfully",
      accessToken: token,
    });
  }
);
export const changePasswordController: RequestHandler = catchAsync(
  async (req, res) => {
    const user = req.user;
    await changePasswordService(user, req.body);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "password updated Successfully",
    });
  }
);

export const logoutController: RequestHandler = catchAsync(async (req, res) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (req as any).logout((err: { message: any }) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
        error: err.message || "An unexpected error occurred",
      });
    }

    // Clear local cookies (e.g., accessToken, refreshToken)
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "logout Successfully",
      // token: result,
      // data: req.session
    });
  });
});
