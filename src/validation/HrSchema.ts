import { z } from "zod";

export const hrSignUpSchemaValidator = z.object({
  body: z.object({
    firstName: z.string().nonempty(),
    lastName: z.string().nonempty(),
    contactNo: z.string(),
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  }),
});

export const hrSignInSchemaValidator = z.object({
  body: z.object({
    email: z.string().nonempty(),
    password: z.string().nonempty(),
  }),
});
