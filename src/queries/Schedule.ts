import { db } from "../model";
import { scheduleTable } from "../model/schema/schedule";
import {
  and,
  between,
  count,
  eq,
  gte,
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
type TScheduleFilters = Omit<
  z.infer<typeof scheduleQueryParamSchema>,
  "limit" | "page"
> & {
  hrId: string;
  offset: number;
  limit: number;
};
export function getScheduleQueryWithFiltersQuery(
  data: TScheduleFilters,
  returnCount = true
) {
  const conditions = [];
  const {
    hrId,
    startDate,
    endDate,
    status,
    name,
    email,
    contactNum,
    limit,
    offset,
  } = data;
  if (startDate) {
    conditions.push(gte(scheduleTable.startDateTime, startDate));
  }
  if (endDate) {
    conditions.push(lte(scheduleTable.endDateTime, endDate));
  }
  if (status) {
    conditions.push(like(scheduleTable.interviewStatus, `${status}%`));
  }
  if (name) {
    conditions.push(
      or(
        like(scheduleTable.candidateFirstName, `${name}%`),
        like(scheduleTable.candidateLastName, `${name}%`)
      )
    );
  }
  if (email) {
    conditions.push(like(scheduleTable.candidateEmail, `${email}%`));
  }
  if (contactNum) {
    conditions.push(like(scheduleTable.candidateContactNum, `${contactNum}%`));
  }
  const queries = [];
  queries.push(
    db
      .select()
      .from(scheduleTable)
      .where(and(eq(scheduleTable.hrId, hrId), ...conditions))
      .limit(limit)
      .offset(offset)
  );
  if (returnCount) {
    queries.push(
      db
        .select({ count: count() })
        .from(scheduleTable)
        .where(and(eq(scheduleTable.hrId, hrId), ...conditions))
    );
  }
  return Promise.all(queries);
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
