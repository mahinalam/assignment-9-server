import { Request, RequestHandler, Response } from "express";
import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { UserService } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const result = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserService.getSingleUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: result,
  });
});

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User Created successfuly!",
    data: result,
  });
});

// const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
//   // console.log(req.query)
//   const filters = pick(req.query, userFilterableFields);
//   const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

//   const result = await userService.getAllFromDB(filters, options);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Users data fetched!",
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await userService.changeProfileStatus(id, req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Users profile status changed!",
//     data: result,
//   });
// });

// const getMyProfile = catchAsync(
//   async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const user = req.user;

//     const result = await userService.getMyProfile(user as IAuthUser);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "My profile data fetched!",
//       data: result,
//     });
//   }
// );

// const updateMyProfie = catchAsync(
//   async (req: Request & { user?: IAuthUser }, res: Response) => {
//     const user = req.user;

//     const result = await userService.updateMyProfie(user as IAuthUser, req);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "My profile updated!",
//       data: result,
//     });
//   }
// );

export const UserController = {
  getAllUsers,
  createUser,
  getSingleUser,
  // changeProfileStatus,
  // getMyProfile,
  // updateMyProfie
};
