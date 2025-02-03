import { defineConfig } from "drizzle-kit";
import env from "./env";
export default defineConfig({
  schema: "./src/model/schema/*",
  out: "./src/model/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
