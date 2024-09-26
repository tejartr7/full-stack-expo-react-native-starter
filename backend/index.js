import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import admin from "firebase-admin";
import connectDB from "./database/DbConnect.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import compression from "compression";
dotenv.config();

const app = express();
app.use(compression());

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/user", userRouter);
app.use("/products", productRouter);
app.listen(8000, () => {
  connectDB(process.env.MONGO_URI);
  console.log("Server is running on port 8000");
});
