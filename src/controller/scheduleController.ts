import { Request, Response } from "express";
import { GetErrorMessage } from "../helpers/utils";
import { APIResponse } from "../helpers/apiReqRes";
import {
  AddScheduleQuery,
  hasScheduleConflictQuery,
  deleteScheduleQuery,
  getScheduleWithFiltersQuery,
  updateScheduleQuery,
  getScheduleByIdQuery,
} from "../queries/Schedule";
import { TInsertSchedule, TUpdateSchedule } from "../types/types";
import { z } from "zod";
import { InterviewStatusConst } from "../config/enum";

export async function createScheduleHandler(req: Request, res: Response) {
  try {
    const data: TInsertSchedule = req.body;
    const hrId = req.user?.hrId || "";
    const insertData = { ...data, hrId };
    const hasConflict = await hasScheduleConflictQuery(insertData);
    if (hasConflict) {
      throw new Error(
        `Schedule conflict: The time range ${hasConflict.startDateTime} - ${hasConflict.endDateTime} is already booked. Please choose a different slot.`
      );
    }
    await AddScheduleQuery(insertData);
    res.status(200).json(APIResponse(true, "Schedule created successfully"));
  } catch (error) {
    const message = GetErrorMessage(error, "Could not create schedule");
    res.status(500).json(APIResponse(false, message));
  }
}

export const scheduleQueryParamSchema = z.object({
  startDateTime: z.string().optional(),
  endDateTime: z.string().optional(),
  candidateFirstName: z.string().optional(),
  candidateLastName: z.string().optional(),
  candidateEmail: z.string().optional(),
  candidateContactNum: z.string().optional(),
  interviewStatus: z.enum(InterviewStatusConst),
});
export async function getScheduleHandler(req: Request, res: Response) {
  try {
    const parsed = scheduleQueryParamSchema.parse(req.query);
    const hrId = req.user.hrId as string;
    const data = {
      hrId,
      ...parsed,
    };
    const schedules = await getScheduleWithFiltersQuery(data);
    res
      .status(200)
      .json(
        APIResponse(true, "Retrieved schedule successfully", { schedules })
      );
  } catch (error) {
    console.log(error);
    const message = GetErrorMessage(error, "Could fetch schedule");
    res.status(500).json(APIResponse(false, message));
  }
}
export async function getScheduleByIdHandler(req: Request, res: Response) {
  try {
    console.log(req.query);
    const parsed = z
      .object({ scheduleId: z.string().nonempty() })
      .parse(req.query);
    const hrId = req.user.hrId as string;
    const data = {
      hrId,
      ...parsed,
    };
    const schedule = await getScheduleByIdQuery(data);
    if (!schedule) {
      res.status(404).json(APIResponse(false, "Schedule not found"));
    }
    res
      .status(200)
      .json(APIResponse(true, "Retrieved schedule successfully", { schedule }));
  } catch (error) {
    console.log(error);
    const message = GetErrorMessage(error, "Could fetch schedule");
    res.status(500).json(APIResponse(false, message));
  }
}

export async function deleteScheduleHandler(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { scheduleIds }: { scheduleIds: string[] } = req.body;
    if (!scheduleIds) {
      throw new Error("Schedule Id Not Provided");
    }
    await deleteScheduleQuery(scheduleIds);
    res.status(200).json(APIResponse(true, "Schedule deleted successfully"));
  } catch (error) {
    const message = GetErrorMessage(error, "Could not delete schedule");
    res.status(500).json(APIResponse(false, message));
  }
}
export async function updateScheduleHandler(req: Request, res: Response) {
  try {
    const data: TUpdateSchedule = req.body;
    if (!data.scheduleId) {
      throw new Error("Schedule Id Not Provided");
    }
    ``;
    await updateScheduleQuery(data);
    res.status(200).json(APIResponse(true, "Schedule updated successfully"));
  } catch (error) {
    const message = GetErrorMessage(error, "Could not update schedule");
    res.status(500).json(APIResponse(false, message));
  }
}
