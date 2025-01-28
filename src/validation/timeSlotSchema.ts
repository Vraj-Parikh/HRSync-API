import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
export const timeSlotSchemaValidator = z.object({
  body: z.object({
    start_time: z.string().refine((value) => timeRegex.test(value)),
    end_time: z.string().refine((value) => timeRegex.test(value)),
  }),
});
