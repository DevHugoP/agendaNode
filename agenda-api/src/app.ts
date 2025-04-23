import "./types/express-ext";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import { setCurrentUser } from "./middlewares/setCurrentUser";
import appointmentsRouter from "./routes/appointement";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";
import profileRouter from "./routes/profile";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // au cas où tu utilises des cookies plus tard
  })
);

app.use(express.json());
app.use(setCurrentUser);

app.use("/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/appointments", appointmentsRouter);
app.use("/api", profileRouter);

app.use(errorHandler);

export default app;
