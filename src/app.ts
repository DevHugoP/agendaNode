import express from "express";
import errorHandler from "./middlewares/errorHandler";
import appointmentsRouter from "./routes/appointement";

const app = express();

app.use(express.json());

app.use("/appointments", appointmentsRouter);

app.use(errorHandler);

export default app;
