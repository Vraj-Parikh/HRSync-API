import {
  date,
  pgEnum,
  pgTable,
  time,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { hrDetailsTable } from "./HrDetail";
import { relations } from "drizzle-orm";

export const InterviewStatusConst = [
  "Pending",
  "Finished",
  "No Show",
  "Rejected",
  "Selected",
] as const;
export const InterviewStatusEnum = pgEnum(
  "interview_status",
  InterviewStatusConst
);
export const scheduleTable = pgTable(
  "schedule",
  {
    scheduleId: uuid("schedule_id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    startTime: time("start_time").notNull(),
    endTime: time("end_time").notNull(),
    hrId: uuid("hr_id")
      .references(() => hrDetailsTable.hrId)
      .notNull(),
    interviewStatus: InterviewStatusEnum("interview_status")
      .default("Pending")
      .notNull(),
    candidateFirstName: varchar("candidate_first_name", {
      length: 255,
    }).notNull(),
    candidateLastName: varchar("candidate_last_name", {
      length: 255,
    }).notNull(),
    candidateContactNo: varchar("candidate_contact_no", {
      length: 255,
    }).unique(),
    candidateEmail: varchar("candidate_email", { length: 255 }).unique(),
  },
  (table) => [
    unique().on(table.date, table.hrId, table.startTime, table.endTime),
  ]
);

export const scheduleRelations = relations(scheduleTable, ({ one }) => ({
  hrId: one(hrDetailsTable, {
    fields: [scheduleTable.hrId],
    references: [hrDetailsTable.hrId],
  }),
}));
