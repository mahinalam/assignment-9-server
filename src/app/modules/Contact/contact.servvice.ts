import prisma from "../../../sharred/prisma";

const sendMessageIntoDB = async (payload: any) => {
  const result = await prisma.contact.create({
    data: payload,
  });

  return result;
};

export const ContactService = {
  sendMessageIntoDB,
};
