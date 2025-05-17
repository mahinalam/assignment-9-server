// import { NextFunction, Request, Response } from "express";
// // import { jwtHelpers } from "../../helpars/jwtHelpers";
// import config from "../../config";
// import { Secret } from "jsonwebtoken";
// import ApiError from "../errors/ApiError";
// import { jwtHelpers } from "../../helpers/jwtHelpers";
// // import ApiError from "../errors/ApiError";

// const auth = (...roles: string[]) => {
//   return async (
//     req: Request & { user?: any },
//     res: Response,
//     next: NextFunction
//   ) => {
//     try {
//       const token = req.headers.authorization;

//       if (!token) {
//         throw new ApiError(401, "You are not authorized!");
//       }

//       const verifiedUser = jwtHelpers.verifyToken(
//         token,
//         config.jwt.jwt_secret as Secret
//       );

//       req.user = verifiedUser;

//       if (roles.length && !roles.includes(verifiedUser.role)) {
//         throw new ApiError(403, "Forbidden!");
//       }
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default auth;

import { NextFunction, Request, Response } from "express";
import catchAsync from "../../sharred/catchAsync";
import { UserRole } from "@prisma/client";
import ApiError from "../errors/ApiError";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import prisma from "../../sharred/prisma";

const auth = (...requiredRoles: (keyof typeof UserRole)[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new ApiError(401, "You are not authorized!");
    }

    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as string
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });

    const status = user?.isDeleted;

    if (status) {
      throw new ApiError(403, "This user is deleted !");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new ApiError(401, "You are not authorized");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
