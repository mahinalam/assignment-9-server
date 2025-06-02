import prisma from "../../../sharred/prisma";
import ApiError from "../../errors/ApiError";

const getNewsLetter = async (email: string) => {
  const result = await prisma.newsLetter.findFirst({
    where: {
      email,
      isDeleted: false,
    },
  });
  return result;
};

const createNewsLetter = async (email: any) => {
  // checking is email exists
  const isNewsLetterExists = await prisma.newsLetter.findFirst({
    where: {
      email,
      isDeleted: false,
    },
  });

  if (isNewsLetterExists) {
    throw new ApiError(400, "News letter alreday exists!");
  }

  const result = await prisma.newsLetter.create({
    data: { email },
  });

  return result;
};

export const NewsLetterService = {
  createNewsLetter,
  getNewsLetter,
};
