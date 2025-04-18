import dotenv from "dotenv";
import express from "express";
import errorHandler from "./middlewares/errorHandler";
import { setCurrentUser } from "./middlewares/setCurrentUser";
import appointmentsRouter from "./routes/appointement";
import authRouter from "./routes/auth";
import userRouter from "./routes/users";

dotenv.config();
const app = express();

app.use(express.json());
app.use(setCurrentUser);

app.use("/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/appointments", appointmentsRouter);

app.use(errorHandler);

export default app;
