"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHanlder_1 = __importDefault(require("./app/middlewares/globalErrorHanlder"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000", // Development environment
        "https://electromert-e-commerce-client.vercel.app", // Production frontend
    ],
    credentials: true, // Allow cookies, authorization headers, etc.
}));
// app.use(cors());
app.use((0, cookie_parser_1.default)());
//parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        Message: "Electromert e-Commerce server..",
    });
});
app.use("/api/v1", routes_1.default);
app.use(globalErrorHanlder_1.default);
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
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
