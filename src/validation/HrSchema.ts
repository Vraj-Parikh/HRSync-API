import { z } from "zod";

export const hrSignUpSchemaValidator = z.object({
  body: z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    contact_no: z.string(),
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
