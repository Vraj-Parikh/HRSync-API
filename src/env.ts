import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  DATABASE_URL: z.string().nonempty(),
  PORT: z.number(),
  JWT_SECRET: z.string().nonempty(),
  JWT_EXPIRY_IN_SEC: z.number(),
});

const env = {
  ...process.env,
  PORT: parseInt(process.env.PORT || "", 10),
  JWT_EXPIRY_IN_SEC: parseInt(process.env.JWT_EXPIRY_IN_SEC || "", 10),
};

const parsed = schema.safeParse(env);

if (!parsed.success) {
  console.log(parsed.error);
  console.error("Invalid Environment Variables");
  process.exit(1);
}

export default parsed.data;
