import { z } from "zod";

const loginSchema = z
  .object({
    email: z.string().trim().min(1, { message: "Email/Username is required" }),
    password: z.string().min(1, { message: "Password is required" }),
  })
  .transform((values) => ({
    email: values.email.trim(),
    password: values.password.trim(),
  }));

export type LoginSchemaType = z.infer<typeof loginSchema>;

export default loginSchema;
