import { eq, or } from "drizzle-orm";
import { db } from "../model";
import { hrDetailsTable } from "../model/schema/HrDetail";
import { hrSignInSchemaValidator } from "../validation/HrSchema";
import { z } from "zod";
import { TSignUpInput } from "../controller/auth/SignIn";

export function SignUp(data: TSignUpInput) {
  return db
    .insert(hrDetailsTable)
    .values(data)
    .returning({ hrId: hrDetailsTable.hrId });
}

export function SignIn(data: z.infer<typeof hrSignInSchemaValidator>["body"]) {
  return db.query.hrDetailsTable.findFirst({
    where: eq(hrDetailsTable.email, data.email),
  });
}

export function GetHrById(hrId: string) {
  return db.query.hrDetailsTable.findFirst({
    where: eq(hrDetailsTable.hrId, hrId),
  });
}
export function GetHrByEmailOrContact(email: string, contactNo: string) {
  return db.query.hrDetailsTable.findFirst({
    where: or(
      eq(hrDetailsTable.email, email),
      eq(hrDetailsTable.contactNum, contactNo)
    ),
  });
}
