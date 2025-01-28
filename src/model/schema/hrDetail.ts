import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";

export const HrDetailsTable = pgTable("hr_details", {
  hr_id: uuid("hr_id").primaryKey().defaultRandom(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  contact_no: varchar("contact_no", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});
