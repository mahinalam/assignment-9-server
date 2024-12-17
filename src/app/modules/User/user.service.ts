import { Request } from "express";
import * as bcrypt from "bcrypt";
import { User, UserRole } from "@prisma/client";
import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

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

export const UserService = {
  getAllUsersFromDB,
  createUserIntoDB,
  getSingleUserFromDB,
};
