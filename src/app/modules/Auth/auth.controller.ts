import { Request, Response } from "express";
import sendResponse from "../../../sharred/sendResponse";
import { AuthServices } from "./auth.service";
import catchAsync from "../../../sharred/catchAsync";
// import httpStatus from "http-status";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged in successfully!",
    data: {
      accessToken: result.accessToken,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token genereated successfully!",
    data: result,
  });
});

// const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
//     const user = req.user;

//     const result = await AuthServices.changePassword(user, req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Password Changed successfully",
//         data: result
//     })
// });

// const forgotPassword = catchAsync(async (req: Request, res: Response) => {

//     await AuthServices.forgotPassword(req.body);

//     sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: "Check your email!",
//         data: null
//     })
// });

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || "";

  await AuthServices.resetPassword(token, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password Reset!",
    data: null,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  // changePassword,
  // forgotPassword,
  // resetPassword
};
