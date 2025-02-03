import { db } from "../model";
import { scheduleTable } from "../model/schema/schedule";
import { and, eq } from "drizzle-orm";
import { TInsertSchedule } from "../types/types";

export function AddScheduleQuery(data: TInsertSchedule & { hr_id: string }) {
  return db.insert(scheduleTable).values({
    ...data,
    date: data.date.toISOString(),
    startTime: data.startTime.toISOString(),
    endTime: data.endTime.toISOString(),
    hrId: data.hr_id,
  });
}

export function GetScheduleQuery(data: { date: Date; hrId: string }) {
  return db.query.scheduleTable.findMany({
    where: and(
      eq(scheduleTable.hrId, data.hrId),
      eq(scheduleTable.date, data.date.toISOString())
    ),
  });
}
