import express, { Application, Request, Response } from "express";
import AuthRouter from "./routes/auth/route";
import { VerifyToken } from "./middlewares/auth/VerifyToken";
import env from "./env";
const app: Application = express();

app.use(express.json());
const ignoredRoutes = ["/api/auth/sign-up", "/api/auth/sign-in"];
// app.use(VerifyToken(ignoredRoutes));
app.use("/api/auth", AuthRouter);

app.listen(env.PORT, () => {
  console.log(`API Running at PORT ${env.PORT}`);
});
