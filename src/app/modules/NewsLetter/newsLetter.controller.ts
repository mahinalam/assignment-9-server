import { Request, Response } from "express";
import catchAsync from "../../../sharred/catchAsync";
import sendResponse from "../../../sharred/sendResponse";
import { NewsLetterService } from "./newsLetter.service";

const getNewsLetter = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.user;
  const result = await NewsLetterService.getNewsLetter(email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "News letter retrieved  successfuly!",
    data: result,
  });
});

const createNewsLetter = catchAsync(async (req: Request, res: Response) => {
  const result = await NewsLetterService.createNewsLetter(req.body.email);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "News letter created successfuly!",
    data: result,
  });
});

export const NewsLetterController = {
  createNewsLetter,
  getNewsLetter,
};
