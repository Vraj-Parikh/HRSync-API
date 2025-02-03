import { Request, Response } from "express";
import { GetErrorMessage } from "../../helpers/utils";
import { APIResponse } from "../../helpers/apiReqRes";
import { AddScheduleQuery, GetScheduleQuery } from "../../queries/Schedule";
import { TInsertSchedule } from "../../types/types";

export async function handleCreateSchedule(req: Request, res: Response) {
  try {
    const data: TInsertSchedule = req.body;
    const hr_id = req.user?.hr_id || "";
    const insertData = { ...data, hr_id };
    await AddScheduleQuery(insertData);
    res.json(APIResponse(true, "Schedule created successfully"));
  } catch (error) {
    const message = GetErrorMessage(error, "Could not create schedule");
    res.json(APIResponse(false, message));
  }
}

export async function getSchedule(req: Request, res: Response) {
  try {
    const data = req.body;
    const response = await GetScheduleQuery(data);
    res.json(
      APIResponse(true, "Retrieved schedule successfully", {
        schedules: { ...response },
      })
    );
  } catch (error) {
    const message = GetErrorMessage(error, "Could fetch schedule");
    res.json(APIResponse(false, message));
  }
}
