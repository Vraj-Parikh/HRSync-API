import { z } from "zod";
import { hrSignUpSchemaValidator } from "../validation/HrSchema";
import { scheduleSchemaValidator } from "../validation/ScheduleSchema";

export type TSignUpInput = z.infer<typeof hrSignUpSchemaValidator>["body"];
export type TInsertSchedule = z.infer<typeof scheduleSchemaValidator>["body"];
export type TUpdateSchedule = z.infer<
  typeof scheduleSchemaValidator
>["body"] & {
  scheduleId: string;
};
export type TPayload = Omit<TSignUpInput, "password">;
export type TSessionRedis = {
  hrId: string;
  isValid: boolean;
};
export type TRefreshToken = {
  sessionId: string;
};
