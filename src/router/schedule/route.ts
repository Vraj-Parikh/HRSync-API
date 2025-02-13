import { Router } from "express";
import { validate } from "../../validation/common";
import { scheduleSchemaValidator } from "../../validation/ScheduleSchema";
import requireAuthentication from "../../middlewares/auth/requireAuthentication";
import {
  createScheduleHandler,
  deleteScheduleHandler,
  getScheduleHandler,
  updateScheduleHandler,
} from "../../controller/scheduleController";

const ScheduleRouter = Router();

ScheduleRouter.post(
  "/",
  [requireAuthentication, validate(scheduleSchemaValidator)],
  createScheduleHandler
);
ScheduleRouter.get("/", requireAuthentication, getScheduleHandler);
ScheduleRouter.post("/delete", requireAuthentication, deleteScheduleHandler);
ScheduleRouter.put("/", requireAuthentication, updateScheduleHandler);
export default ScheduleRouter;
