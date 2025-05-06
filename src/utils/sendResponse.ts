import type { Response } from "express";

interface IResponse<T> {
  status: number;
  success: boolean;
  message?: string;
  data?: T;

  accessToken?: string;
  refreshToken?: string;
}

export const sendResponse = <T>(
  res: Response,
  { data, message, status, success, accessToken, refreshToken }: IResponse<T>
) => {
  return res.status(status).json({
    status,
    success,
    message,
    data,
    accessToken,
    refreshToken,
  });
};
