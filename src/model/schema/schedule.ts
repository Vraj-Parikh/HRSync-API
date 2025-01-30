import { date, pgEnum, pgTable, unique, uuid } from "drizzle-orm/pg-core";
import { CandidateDetailsTable } from "./candidateDetail";
import { TimeSlotsTable } from "./timeSlot";
import { HrDetailsTable } from "./hrDetail";

export const InterviewStatusEnum = pgEnum("interview_status", [
  "Pending",
  "Finished",
]);
export const ScheduleTable = pgTable(
  "schedule",
  {
    schedule_id: uuid("schedule_id").primaryKey().defaultRandom(),
    date: date("date").notNull(),
    time_slot_id: uuid("time_slot_id")
      .references(() => TimeSlotsTable.time_slot_id)
      .notNull(),
    hr_id: uuid("hr_id")
      .references(() => HrDetailsTable.hr_id)
      .notNull(),
    interview_status: InterviewStatusEnum().default("Pending").notNull(),
    candidate_id: uuid("candidate_id")
      .references(() => CandidateDetailsTable.candidate_id)
      .notNull(),
  },
  (table) => [unique().on(table.date, table.time_slot_id, table.hr_id)]
);
