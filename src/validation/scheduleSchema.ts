import { z } from "zod";

export const scheduleSchemaValidator = z.object({
  body: z.object({
    date: z.date(),
    time_slot_id: z.string().nonempty(),
    candidate_id: z.string().nonempty(),
    // hr_id from token
  }),
});
