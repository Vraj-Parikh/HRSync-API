import { Router } from "express";
import { validate } from "../../validation/common";
import {
  timeSlotSchemaValidatorDelete,
  timeSlotSchemaValidatorInsert,
  timeSlotSchemaValidatorUpdate,
} from "../../validation/timeSlotSchema";
import {
  handleAddTimeSlot,
  handleDeleteTimeSlot,
  handleGetTimeSlot,
  handleUpdateTimeSlot,
} from "../../controller/auth/timeSlotController";

const TimeSlotRouter = Router();

TimeSlotRouter.post(
  "/",
  validate(timeSlotSchemaValidatorInsert),
  handleAddTimeSlot
);
TimeSlotRouter.delete(
  "/",
  validate(timeSlotSchemaValidatorDelete),
  handleDeleteTimeSlot
);
TimeSlotRouter.patch(
  "/",
  validate(timeSlotSchemaValidatorUpdate),
  handleUpdateTimeSlot
);
TimeSlotRouter.get("/", handleGetTimeSlot);
export default TimeSlotRouter;
