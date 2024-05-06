import { z } from "zod";

const registerSchema = z
  .object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .trim()
      .min(2, { message: "Name must be between 2-30 characters long" })
      .max(30, { message: "Name must be between 2-30 characters long" }),
    email: z.string().trim().min(1, { message: "Email is required" }).email({
      message: "Invalid email",
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
    name: values.name.trim(),
    email: values.email.trim(),
    password: values.password.trim(),
  }));

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export default registerSchema;
