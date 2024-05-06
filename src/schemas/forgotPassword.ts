import { z } from "zod";

const forgotPasswordSchema = z
  .object({
    email: z.string().trim().min(1, { message: "Email is required" }).email({
      message: "Invalid email",
    }),
  })
  .transform((values) => ({
    email: values.email.trim(),
  }));

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;

export default forgotPasswordSchema;
