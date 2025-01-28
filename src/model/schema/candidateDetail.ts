import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const CandidateDetailsTable = pgTable("candidate_details", {
  candidate_id: uuid("candidate_id").primaryKey().defaultRandom(),
  first_name: varchar("name", { length: 255 }).notNull(),
  last_name: varchar("name", { length: 255 }).notNull(),
  contact_no: varchar("contact_no", { length: 255 }).unique(),
  email: varchar("email", { length: 255 }).unique(),
});
