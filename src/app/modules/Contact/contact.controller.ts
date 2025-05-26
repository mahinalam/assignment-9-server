import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { ContactService } from "./contact.servvice";

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await ContactService.sendMessageIntoDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Message sent successfuly!",
    data: result,
  });
});

export const ContactController = {
  sendMessage,
};
