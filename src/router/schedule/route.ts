import { Router } from "express";
import { validate } from "../../validation/common";
import { scheduleSchemaValidator } from "../../validation/ScheduleSchema";

const ScheduleRouter = Router();

ScheduleRouter.get("/", validate(scheduleSchemaValidator));
export default ScheduleRouter;
