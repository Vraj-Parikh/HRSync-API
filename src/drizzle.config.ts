import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./src/model/schema/*",
//   out: "./src/model/migrations",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.DATABASE_URL || "",
//   },
//   verbose: true,
//   strict: true,
// });
export default defineConfig({
  schema: "./model/schema/*",
  out: "./model/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
