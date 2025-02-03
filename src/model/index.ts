import { drizzle } from "drizzle-orm/postgres-js";
import * as hrDetailsSchema from "./schema/HrDetail";
import * as scheduleSchema from "./schema/schedule";
import postgres from "postgres";
import env from "../env";
const queryClient = postgres(env.DATABASE_URL);
const schema = {
  ...hrDetailsSchema,
  ...scheduleSchema,
};
export const db = drizzle({ client: queryClient, schema, logger: true });
