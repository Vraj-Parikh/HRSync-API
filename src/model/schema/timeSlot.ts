import { pgTable, time, unique, uuid } from "drizzle-orm/pg-core";
import { HrDetailsTable } from "./hrDetail";

export const TimeSlotsTable = pgTable(
  "time_slots",
  {
    time_slot_id: uuid("time_slot_id").primaryKey().defaultRandom(),
    hr_id: uuid("hr_id")
      .notNull()
      .references(() => HrDetailsTable.hr_id),
    start_time: time("start_time").notNull(),
    end_time: time("end_time").notNull(),
  },
  (table) => [
    unique("slot_time_unique").on(
      table.start_time,
      table.end_time,
      table.hr_id
    ),
  ]
);
