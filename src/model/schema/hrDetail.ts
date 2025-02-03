import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { scheduleTable } from "./schedule";
export const hrDetailsTable = pgTable("hr_details", {
  hrId: uuid("hr_id").primaryKey().defaultRandom(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  contactNo: varchar("contact_no", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const hrRelations = relations(hrDetailsTable, ({ many }) => ({
  schedule: many(scheduleTable),
}));
