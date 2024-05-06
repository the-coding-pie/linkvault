import { z } from "zod";

const addTempLinkSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, { message: "Title cannot be empty" })
      .max(100, {
        message: "Title should be less than or equal to 100 characters long",
      }),
    description: z.string().trim().max(150, {
      message:
        "Description should be less than or equal to 150 characters long",
    }),
    url: z
      .string()
      .url({ message: "Please enter a valid URL (e.g., https://example.com)" })
      .trim()
      .min(1, { message: "URL cannot be empty" }),
    category: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
        isNew: z.boolean().optional(),
      })
      .refine((value) => value.label && value.value, {
        message: "Category cannot be empty",
      }),
    subCategory: z
      .object({
        label: z.string().optional(),
        value: z.string().optional(),
        isNew: z.boolean().optional(),
      })
      .refine((value) => value.label && value.value, {
        message: "Sub Category cannot be empty",
      }),
  })
  .transform((values) => ({
    title: values.title.trim(),
    description: values.description.trim(),
    url: values.url.trim(),
    category: {
      ...values.category,
      label: values.category.label?.trim(),
      value: values.category.value?.trim(),
    },
    subCategory: {
      ...values.subCategory,
      label: values.subCategory.label?.trim(),
      value: values.subCategory.value?.trim(),
    },
  }));

export type AddTempLinkSchemaType = z.infer<typeof addTempLinkSchema>;

export default addTempLinkSchema;
