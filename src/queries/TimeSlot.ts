import { eq } from "drizzle-orm";
import { db } from "../model";
import { TimeSlotsTable } from "../model/schema/timeSlot";

export type TInsertTimeSlot = Omit<
  typeof TimeSlotsTable.$inferInsert,
  "time_slot_id"
>;
export function AddTimeSlot(data: TInsertTimeSlot) {
  return db.insert(TimeSlotsTable).values(data);
}
export function GetTimeSlot() {
  return db.select().from(TimeSlotsTable);
}

export function DeleteTimeSlot(time_slot_id: string) {
  return db
    .delete(TimeSlotsTable)
    .where(eq(TimeSlotsTable.time_slot_id, time_slot_id));
}

export function UpdateTimeSlot(data: typeof TimeSlotsTable.$inferInsert) {
  return db
    .update(TimeSlotsTable)
    .set(data)
    .where(eq(TimeSlotsTable.time_slot_id, data.time_slot_id || ""));
}
