/* eslint-disable no-console */
import { UserRole } from "@prisma/client";
import config from "../config";
import prisma from "../sharred/prisma";
import * as bcrypt from "bcrypt";

export const seed = async () => {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
        email: config.admin_email,
      },
    });

    if (!admin) {
      await prisma.$transaction(async (tx) => {
        //atfirst check if the admin exist of not

        console.log("Seeding started...");
        const hashedPassword = await bcrypt.hash(
          config.admin_password as string,
          12
        );
        const adminData = await tx.user.create({
          data: {
            role: UserRole.ADMIN,
            email: config.admin_email as string,
            password: hashedPassword,
          },
        });
        await tx.admin.create({
          data: {
            userId: adminData.id,
            email: adminData.email,
            gender: "MALE",
            name: "Mahin",
            address: "Dhamrai, Dhaka",
            phoneNumber: "0123456789",
          },
        });
        console.log("Admin created successfully...");
        console.log("Seeding completed...");
      });
    }
  } catch (error) {
    console.log("Error in seeding", error);
  }
};
