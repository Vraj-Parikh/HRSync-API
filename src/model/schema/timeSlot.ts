import { pgTable, time, uuid } from "drizzle-orm/pg-core";

export const TimeSlotsTable = pgTable("time_slots", {
  time_slot_id: uuid("time_slot_id").primaryKey().defaultRandom(),
  start_time: time("start_time").notNull(),
  end_time: time("end_time").notNull(),
});
