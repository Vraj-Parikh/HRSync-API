import { drizzle } from "drizzle-orm/postgres-js";
import * as hrDetailsSchema from "./schema/hrDetail";
import * as timeSlotSchema from "./schema/timeSlot";
import * as scheduleSchema from "./schema/schedule";
import * as candidateDetailsSchema from "./schema/candidateDetail";
import postgres from "postgres";
import env from "../env";
const queryClient = postgres(env.DATABASE_URL);
const schema = {
  hrDetailsSchema,
  timeSlotSchema,
  scheduleSchema,
  candidateDetailsSchema,
};
export const db = drizzle({ client: queryClient, schema, logger: true });
