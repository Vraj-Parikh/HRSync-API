import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
export const timeSlotSchemaValidatorInsert = z.object({
  body: z.object({
    start_time: z
      .string()
      .nonempty()
      .refine((value) => timeRegex.test(value)),
    end_time: z
      .string()
      .nonempty()
      .refine((value) => timeRegex.test(value)),
  }),
});
export const timeSlotSchemaValidatorUpdate = z.object({
  body: z.object({
    time_slot_id: z.string().nonempty(),
    start_time: z
      .string()
      .nonempty()
      .refine((value) => timeRegex.test(value)),
    end_time: z
      .string()
      .nonempty()
      .refine((value) => timeRegex.test(value)),
  }),
});
export const timeSlotSchemaValidatorDelete = z.object({
  body: z.object({
    id: z.string().nonempty(),
  }),
});
