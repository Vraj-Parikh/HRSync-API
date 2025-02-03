import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
import type { StringValue } from "ms";

const StringValueSchema = z.custom<StringValue>(
  (val) => typeof val === "string",
  {
    message: "Invalid format for StringValue",
  }
);
const schema = z.object({
  DATABASE_URL: z.string().nonempty(),
  BCRYPT_SALT: z.number(),
  PORT: z.number(),
  JWT_ACCESS_TOKEN_EXPIRY: StringValueSchema,
  JWT_REFRESH_TOKEN_EXPIRY: StringValueSchema,
  JWT_ACCESS_TOKEN_SECRET: StringValueSchema,
  JWT_REFRESH_TOKEN_SECRET: StringValueSchema,
});
const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  BCRYPT_SALT: parseInt(process.env.BCRYPT_SALT || "", 10),
  PORT: parseInt(process.env.PORT || "", 10),
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || "",
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || "",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "",
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "",
};

const parsed = schema.safeParse(env);

if (!parsed.success) {
  console.log(parsed.error);
  console.error("Invalid Environment Variables");
  process.exit(1);
}

const env_parsed = parsed.data;
export default env_parsed;
