import express, { Application, Request, Response } from "express";
import AuthRouter from "./router/auth/route";
import { DeserializeUser } from "./middlewares/auth/deserializeUser";
import env from "./env";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));

//custom middleware
app.use(DeserializeUser);

//routes
app.use("/api/auth", AuthRouter);

app.listen(env.PORT, () => {
  console.log(`API Running at PORT ${env.PORT}`);
});
