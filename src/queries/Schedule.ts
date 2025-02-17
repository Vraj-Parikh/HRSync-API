import { db } from "../model";
import { scheduleTable } from "../model/schema/schedule";
import {
  and,
  between,
  count,
  eq,
  gte,
  ilike,
  inArray,
  like,
  lte,
  or,
} from "drizzle-orm";
import { TInsertSchedule, TUpdateSchedule } from "../types/types";
import { z } from "zod";
import { scheduleQueryParamSchema } from "../controller/scheduleController";

export function AddScheduleQuery(data: TInsertSchedule & { hrId: string }) {
  return db.insert(scheduleTable).values({
    ...data,
    candidateEmail: data.candidateEmail || null,
    candidateContactNum: data.candidateContactNum || null,
    startDateTime: data.startDateTime,
    endDateTime: data.endDateTime,
    hrId: data.hrId,
  });
}
export function hasScheduleConflictQuery(
  data: TInsertSchedule & { hrId: string }
) {
  const { hrId, startDateTime, endDateTime } = data;
  return db.query.scheduleTable.findFirst({
    where: and(
      eq(scheduleTable.hrId, hrId),
      or(
        between(scheduleTable.startDateTime, startDateTime, endDateTime),
        between(scheduleTable.endDateTime, startDateTime, endDateTime)
      )
    ),
  });
}
type TScheduleFilters = z.infer<typeof scheduleQueryParamSchema> & {
  hrId: string;
};
export function getScheduleWithFiltersQuery(data: TScheduleFilters) {
  const {
    hrId,
    startDateTime,
    endDateTime,
    interviewStatus,
    candidateFirstName,
    candidateLastName,
    candidateEmail,
    candidateContactNum,
  } = data;
  const conditions = [eq(scheduleTable.hrId, hrId)];
  if (startDateTime) {
    conditions.push(gte(scheduleTable.startDateTime, startDateTime));
  }
  if (endDateTime) {
    conditions.push(lte(scheduleTable.endDateTime, endDateTime));
  }
  if (interviewStatus) {
    conditions.push(eq(scheduleTable.interviewStatus, `${interviewStatus}`));
  }
  if (candidateFirstName) {
    conditions.push(
      ilike(scheduleTable.candidateFirstName, `${candidateFirstName}%`)
    );
  }
  if (candidateLastName) {
    conditions.push(
      ilike(scheduleTable.candidateLastName, `${candidateLastName}%`)
    );
  }
  if (candidateEmail) {
    conditions.push(ilike(scheduleTable.candidateEmail, `${candidateEmail}%`));
  }
  if (candidateContactNum) {
    conditions.push(
      ilike(scheduleTable.candidateContactNum, `${candidateContactNum}%`)
    );
  }
  return db
    .select()
    .from(scheduleTable)
    .where(and(...conditions));
}
export function getScheduleByIdQuery(data: {
  hrId: string;
  scheduleId: string;
}) {
  const { hrId, scheduleId } = data;

  return db.query.scheduleTable.findFirst({
    where: and(
      eq(scheduleTable.hrId, hrId),
      eq(scheduleTable.scheduleId, scheduleId)
    ),
  });
}

export function deleteScheduleQuery(scheduleId: string[]) {
  return db
    .delete(scheduleTable)
    .where(inArray(scheduleTable.scheduleId, scheduleId));
}
export function updateScheduleQuery(data: TUpdateSchedule) {
  return db
    .update(scheduleTable)
    .set({
      ...data,
      candidateEmail: data.candidateEmail || null,
      candidateContactNum: data.candidateContactNum || null,
    })
    .where(eq(scheduleTable.scheduleId, data.scheduleId));
}
