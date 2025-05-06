import httpStatus from "http-status";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import {
  access_token,
  access_token_expiry,
  refresh_token,
  refresh_token_expiry,
} from "../../config";
import { CustomError } from "../../errors/CustomError";
import { sendMail } from "../../utils/emailSender";
import { genarateToken } from "../../utils/genarateToken";
import type { IUser, IUserMethod } from "../user/user.interface";
import { User } from "../user/user.model";
import type { ILogin, TJwtPayload } from "./auth.interface";
import { activationCode } from "./auth.utils";

export const prepareForActivateService = async (payload: IUser) => {
  if (await User.isUserExists(payload)) {
    throw new CustomError(404, "User Already Exists");
  }

  const { code, token } = activationCode(payload);

  await sendMail(payload.email, "Account Activation ", { ...payload, code });

  return {
    code,
    token,
  };
};

export const createUserService = async (payload: IUser) => {
  if (await User.isUserExists(payload)) {
    throw new CustomError(404, "User Already Exists");
  }
  const result = await User.create(payload);

  const jwtPayload: TJwtPayload = {
    name: result.name,
    email: result.email,
    role: result.role,
    username: result.username,
    userId: result._id,
  };
  const token = genarateToken(jwtPayload, access_token, access_token_expiry);
  return {
    result,
    token,
  };
};

export const loginService = async (payload: ILogin) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  // Check User Exist Or not
  if (!user) {
    throw new CustomError(404, "User not exists please create an account");
  }

  //   Check User Is Deleted Or not
  if (user.isDeleted) {
    throw new CustomError(httpStatus.FORBIDDEN, "Already Deleted User");
  }

  //   check Passsword Is Valid or Not
  const isPasswordValid = (user as IUserMethod).comparePassword(
    payload.password
  );

  if (!isPasswordValid) {
    throw new CustomError(httpStatus.FORBIDDEN, "Invalid UserID or Password");
  }

  const jwtPayload: TJwtPayload = {
    userId: user._id,
    email: user.email,
    name: user.username,
    role: user.role,
    username: user.username,
  };

  //   now Need to make AccessToken and RefreshToken

  const accessToken = genarateToken(
    jwtPayload,
    access_token,
    access_token_expiry
  );

  const refreshToken = genarateToken(
    jwtPayload,
    refresh_token,
    refresh_token_expiry
  );

  const { password: _, ...rest } = user.toObject();
  return {
    accessToken,
    refreshToken,
    rest,
  };
};

export const refreshTokenService = async (token: string) => {
  const decoded = jwt.verify(token, refresh_token) as JwtPayload;

  const { email } = decoded;
  const user = await User.isUserExists(email);

  if (!user) {
    throw new CustomError(httpStatus.NOT_FOUND, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new CustomError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  const jwtPayload: TJwtPayload = {
    userId: user._id,
    email: user.email,
    name: user.username,
    role: user.role,
    username: user.username,
  };

  const accessToken = genarateToken(
    jwtPayload,
    access_token,
    access_token_expiry
  );

  return accessToken;
};

//   Forget And Reset Password

export const forgetPasswordService = async (payload: Partial<IUser>) => {
  const user = await User.isUserExists(payload);
  if (!user) {
    throw new CustomError(404, "User Not Found");
  }
  const jwtPayload: TJwtPayload = {
    userId: user._id,
    email: user.email,
    name: user.username,
    role: user.role,
    username: user.username,
  };

  const resetToken = genarateToken(
    jwtPayload,
    access_token,
    access_token_expiry
  );
  // const resetUILink = `reset-password?email=${user.email}&token=${resetToken} `
  await sendMail(
    payload.email,
    "Password Reset",
    { ...payload, token: resetToken },
    "reset"
  );
  return resetToken;
};

// Password Resetting Service

export const resetPasswordPasswordService = async (
  token: string,
  payload: Partial<IUser>
) => {
  const decoded: Partial<IUser & JwtPayload> = jwt.verify(
    token,
    access_token
  ) as JwtPayload;

  await User.updatePassword(decoded.email as string, payload);
};
export const changePasswordService = async (
  userData: Partial<IUser> | JwtPayload,
  payload: any
) => {
  const payData: Partial<IUser> = {
    email: userData.email,
  };
  const user = await User.findOne({ email: payData.email }).select("+password");
  // Check User Exist Or not
  if (!user) {
    throw new CustomError(404, "User not exists please create an account");
  }
  //   Check User Is Deleted Or not

  //   check Passsword Is Valid or Not

  const isPasswordValid = user.comparePassword(payload.oldPassword);

  if (!isPasswordValid) {
    throw new CustomError(httpStatus.FORBIDDEN, "Invalid UserID or Password");
  }

  await User.updatePassword(user.email as string, payload);
};
