import { z } from "zod";

export const scheduleSchemaValidator = z.object({
  body: z.object({
    date: z.date(),
    time_slot_id: z.string(),
    candidate_id: z.string(),
    // hr_id from token
  }),
});
