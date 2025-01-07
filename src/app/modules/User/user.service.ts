import { Request } from "express";
import * as bcrypt from "bcrypt";
import { User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";
import { TImageFile } from "../../interfaces/file";

const createUserIntoDB = async (payload: User) => {
  // check if the user alredat exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
      isDeleted: false,
    },
  });

  if (isUserExists) {
    throw new ApiError(400, "User Alreday Exists!");
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData,
    select: {
      id: true,
      email: true,
      name: true,
      address: true,
      order: true,
      phoneNumber: true,
      role: true,
      shop: true,
      status: true,
      review: true,
    },
  });

  return result;
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      shop: true,
      order: true,
      review: true,
    },
  });
  return result;
};

const updateMyProfile = async (user: User, image?: TImageFile) => {
  console.log("from backend user", user);
  console.log("from backend image", image);
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (image) {
    user.profilePhoto = image.path;
  }

  const result = await prisma.user.update({
    where: {
      email: userInfo.email,
    },
    data: user,
  });

  return result;
};

export const UserService = {
  getAllUsersFromDB,
  createUserIntoDB,
  getSingleUserFromDB,
  updateMyProfile,
};
