import { FORGOT_PASSWORD_TOKEN_LENGTH } from "@/configs";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .trim()
      .min(1, { message: "Token is required" })
      .max(FORGOT_PASSWORD_TOKEN_LENGTH, {
        message: "Sorry, your password reset link has expired or is malformed",
      }),
    password: z
      .string()
      .trim()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*\d)(?=.*[a-zA-Z]).*$/, {
        message: "Password must contain at least one letter and one number",
      }),
  })
  .transform((values) => ({
    token: values.token.trim(),
    password: values.password.trim(),
  }));

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;

export default resetPasswordSchema;
