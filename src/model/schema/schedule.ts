import {
  date,
  pgEnum,
  pgTable,
  time,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { hrDetailsTable } from "./HrDetail";
import { relations } from "drizzle-orm";
import { InterviewStatusConst } from "../../config/enum";

export const InterviewStatusEnum = pgEnum(
  "interview_status",
  InterviewStatusConst
);
export const scheduleTable = pgTable(
  "schedule",
  {
    scheduleId: uuid("schedule_id").primaryKey().defaultRandom(),
    startDateTime: timestamp("start_date_time", {
      precision: 0,
      withTimezone: true,
      mode: "string",
    }).notNull(),
    endDateTime: timestamp("end_date_time", {
      precision: 0,
      withTimezone: true,
      mode: "string",
    }).notNull(),
    hrId: uuid("hr_id")
      .references(() => hrDetailsTable.hrId)
      .notNull(),
    interviewStatus: InterviewStatusEnum("interview_status")
      .default("PENDING")
      .notNull(),
    candidateFirstName: varchar("candidate_first_name", {
      length: 255,
    }).notNull(),
    candidateLastName: varchar("candidate_last_name", {
      length: 255,
    }).notNull(),
    candidateContactNum: varchar("candidate_contact_num", {
      length: 255,
    }).unique(),
    candidateEmail: varchar("candidate_email", { length: 255 }).unique(),
  },
  (table) => [unique().on(table.hrId, table.startDateTime, table.endDateTime)]
);

export const scheduleRelations = relations(scheduleTable, ({ one }) => ({
  hrId: one(hrDetailsTable, {
    fields: [scheduleTable.hrId],
    references: [hrDetailsTable.hrId],
  }),
}));
