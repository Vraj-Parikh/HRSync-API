import { eq } from "drizzle-orm";
import { db } from "../model";
import { HrDetailsTable } from "../model/schema/hrDetail";
import { hrSignInSchemaValidator } from "../validation/HrSchema";
import { z } from "zod";
import { signUpInput } from "../controller/auth/authController";

export function SignUp(data: signUpInput) {
  return db
    .insert(HrDetailsTable)
    .values(data)
    .returning({ id: HrDetailsTable.hr_id });
}

export function SignIn(data: z.infer<typeof hrSignInSchemaValidator>["body"]) {
  return db
    .select()
    .from(HrDetailsTable)
    .where(eq(HrDetailsTable.email, data.email));
}
