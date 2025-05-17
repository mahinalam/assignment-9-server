import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHanlder";

const app: Application = express();
app.use(
  cors({
    origin: [
      "http://localhost:3001", // Development environment
      "https://electromert-e-commerce-client.vercel.app", // Production frontend
    ],
    credentials: true, // Allow cookies, authorization headers, etc.
  })
);
// app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Electromert e-Commerce server..",
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;

// import Navbar from "@/app/components/sharred/Navbar";

// export default function layout({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="relative flex flex-col h-screen w-[90%] mx-auto">
//       <Navbar />
//       <main>{children}</main>
//     </div>
//   );
// }

// ("use client");

// import Categories from "@/app/components/home/Categories/Categories";
// import FlashSale from "@/app/components/home/FlashSale/FlashSale";
// import JustForYou from "@/app/components/home/JustForYou/JustForYou";
// import Container from "@/app/components/sharred/Container";
// import React from "react";

// const Home = () => {
//   return (
//     <Container>
//       <FlashSale />
//       <Categories />
//       <JustForYou />
//     </Container>
//   );
// };

// export default Home;
