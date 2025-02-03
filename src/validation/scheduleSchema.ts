import { z } from "zod";
import { InterviewStatusConst } from "../model/schema/schedule";

export const scheduleSchemaValidator = z.object({
  body: z.object({
    date: z.date(),
    startTime: z.date(),
    endTime: z.date(),
    // hrId from token
    interviewStatus: z.enum(InterviewStatusConst),
    candidateFirstName: z.string().nonempty(),
    candidateLastName: z.string().nonempty(),
    candidateEmail: z.string().email().optional(),
    candidateContactNo: z.string().optional(),
  }),
});
