import { z } from "zod";

const courseFields = {
  title: z.string().trim().min(1, "Course title is required.").max(120),
  description: z.string().trim().max(2000).optional(),
  duration: z.string().trim().min(1, "Course duration is required.").max(80),
  fee: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, "Fee must be a positive amount with up to 2 decimal places.")
    .refine((value) => Number(value) > 0 && Number(value) <= 99999999.99, {
      message: "Fee must be greater than 0 and no more than 99,999,999.99.",
    }),
};

export const createCourseSchema = z.object(courseFields);

export const updateCourseSchema = createCourseSchema.extend({
  id: z.coerce.number().int().positive("A valid course ID is required."),
});

export const deleteCourseSchema = z.object({
  id: z.coerce.number().int().positive("A valid course ID is required."),
});