import { Router } from "express";
import { validate } from "../../validation/common";
import { scheduleSchemaValidator } from "../../validation/ScheduleSchema";
import requireAuthentication from "../../middlewares/auth/requireAuthentication";
import {
  createScheduleHandler,
  deleteScheduleHandler,
  getScheduleByIdHandler,
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
ScheduleRouter.get("/byId", requireAuthentication, getScheduleByIdHandler);
ScheduleRouter.post("/delete", requireAuthentication, deleteScheduleHandler);
ScheduleRouter.put("/", requireAuthentication, updateScheduleHandler);
export default ScheduleRouter;
