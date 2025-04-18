import express from "express";
import errorHandler from "./middlewares/errorHandler";
import { setCurrentUser } from "./middlewares/setCurrentUser";
import appointmentsRouter from "./routes/appointement";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());
app.use(setCurrentUser);

app.use("/appointments", appointmentsRouter);
app.use("/users", usersRouter);

app.use(errorHandler);

export default app;
