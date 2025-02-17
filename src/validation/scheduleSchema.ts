import { z } from "zod";
import { InterviewStatusConst } from "../config/enum";

export const contactValidator = z
  .string()
  .regex(
    /^\d{10}$/,
    "Contact number must be of 10 digits and contain only numbers"
  );

export const scheduleSchemaValidator = z.object({
  body: z.object({
    startDateTime: z.string().nonempty(),
    endDateTime: z.string().nonempty(),
    // hrId from token
    interviewStatus: z.enum(InterviewStatusConst).optional(),
    candidateFirstName: z.string().nonempty(),
    candidateLastName: z.string().nonempty(),
    candidateEmail: z
      .string()
      .refine(
        (email) => !email || z.string().email().safeParse(email).success,
        {
          message: "Invalid email format",
        }
      ),
    candidateContactNum: z
      .string()
      .refine(
        (contactNo) =>
          !contactNo || contactValidator.safeParse(contactNo).success,
        {
          message:
            contactValidator._def.checks?.[0]?.message ||
            "Invalid Contact Number",
        }
      ),
  }),
});
