/* eslint-disable no-console */
import { UserRole, UserStatus } from "@prisma/client";
import config from "../config";
import prisma from "../sharred/prisma";
import * as bcrypt from "bcrypt";

export const seed = async () => {
  try {
    //atfirst check if the admin exist of not
    const admin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
        email: config.admin_email,
        status: UserStatus.ACTIVE,
      },
    });
    if (!admin) {
      console.log("Seeding started...");
      const hashedPassword = await bcrypt.hash(
        config.admin_password as string,
        12
      );
      await prisma.user.create({
        data: {
          name: "Mahin",
          role: UserRole.ADMIN,
          email: config.admin_email as string,

          password: hashedPassword,
          address: "Dhamrai, Dhaka",
          phoneNumber: "0123456789",
          status: UserStatus.ACTIVE,
        },
      });
      console.log("Admin created successfully...");
      console.log("Seeding completed...");
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
