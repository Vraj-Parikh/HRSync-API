import express, { Application, Request, Response } from "express";
import AuthRouter from "./routes/auth/route";
import { VerifyToken } from "./middlewares/auth/VerifyToken";
import env from "./env";
import TimeSlotRouter from "./routes/timeSlot/route";
const app: Application = express();
import cors from "cors";
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

//custom middleware
const ignoredRoutes = ["/api/auth/sign-up", "/api/auth/sign-in"];
app.use(VerifyToken(ignoredRoutes));

app.use("/api/auth", AuthRouter);
app.use("/api/time-slot", TimeSlotRouter);
app.use("/api/schedule", TimeSlotRouter);

app.listen(env.PORT, () => {
  console.log(`API Running at PORT ${env.PORT}`);
});
