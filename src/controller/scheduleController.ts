import { Request, Response } from "express";
import { GetErrorMessage } from "../helpers/utils";
import { APIResponse } from "../helpers/apiReqRes";
import {
  AddScheduleQuery,
  hasScheduleConflictQuery,
  deleteScheduleQuery,
  getScheduleQueryWithFiltersQuery,
  updateScheduleQuery,
} from "../queries/Schedule";
import { TInsertSchedule, TUpdateSchedule } from "../types/types";
import { z } from "zod";

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
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.string().optional(),
  name: z.string().optional(),
  email: z.string().optional(),
  contactNum: z.string().optional(),
  page: z.string().default("1"),
  limit: z.string().default("10"),
});
export async function getScheduleHandler(req: Request, res: Response) {
  try {
    console.log(req.query);
    const parsed = scheduleQueryParamSchema.parse(req.query);
    const hrId = req.user.hrId as string;

    const pageNumber = parseInt(parsed.page);
    const pageSize = parseInt(parsed.limit);
    const offset = (pageNumber - 1) * pageSize;
    const data = {
      hrId,
      ...parsed,
      limit: pageSize,
      offset: offset,
    };
    const [schedules, scheduleCount] = await getScheduleQueryWithFiltersQuery(
      data
    );
    //@ts-ignore
    const totalPages = Math.ceil(pageNumber / scheduleCount[0].count);
    const responseData = {
      schedules,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        pageSize,
      },
    };
    res
      .status(200)
      .json(APIResponse(true, "Retrieved schedule successfully", responseData));
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
