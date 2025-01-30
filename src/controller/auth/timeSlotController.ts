import { Request, Response } from "express";
import {
  AddTimeSlot,
  DeleteTimeSlot,
  GetTimeSlot,
  TInsertTimeSlot,
} from "../../queries/TimeSlot";
import { APIResponse } from "../../helpers/apiReqRes";
import { GetErrorMessage } from "../../helpers/utils";
import { TimeSlotsTable } from "../../model/schema/timeSlot";

export async function handleAddTimeSlot(req: Request, res: Response) {
  try {
    const data: TInsertTimeSlot = req.body;
    await AddTimeSlot(data);
    res.status(200).json(APIResponse(true, "Slot Inserted Successfully"));
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Could not insert time slots");
    res.status(400).json(APIResponse(false, msg));
  }
}

export async function handleDeleteTimeSlot(req: Request, res: Response) {
  try {
    const data: { time_slot_id: string } = req.body;
    await DeleteTimeSlot(data.time_slot_id);
    res.status(200).json(APIResponse(true, "Slot Deleted Successfully"));
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Could not delete time slots");
    res.status(400).json(APIResponse(false, msg));
  }
}
export async function handleUpdateTimeSlot(req: Request, res: Response) {
  try {
    const data: typeof TimeSlotsTable.$inferInsert = req.body;
    await AddTimeSlot(data);
    res.status(200).json(APIResponse(true, "Slot Updated Successfully"));
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Could not updates time slots");
    res.status(400).json(APIResponse(false, msg));
  }
}
export async function handleGetTimeSlot(req: Request, res: Response) {
  try {
    const timeSlots = await GetTimeSlot();
    res
      .status(200)
      .json(APIResponse(true, "Retrieved Successfully", { timeSlots }));
  } catch (error: unknown) {
    const msg = GetErrorMessage(error, "Could not fetch time slots");
    res.status(400).json(APIResponse(false, msg));
  }
}
