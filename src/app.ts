import express, { Application, Request, Response } from "express";
import AuthRouter from "./router/auth/route";
import { DeserializeUser } from "./middlewares/auth/deserializeUser";
import env from "./env";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors";
import ScheduleRouter from "./router/schedule/route";
import statusMonitor from "express-status-monitor";

const app: Application = express();
app.use(statusMonitor());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));

//custom middleware
app.use(DeserializeUser);

//routes
app.use("/api/auth", AuthRouter);
app.use("/api/schedule", ScheduleRouter);

app.listen(env.PORT, () => {
  console.log(`API Running at PORT ${env.PORT}`);
});
