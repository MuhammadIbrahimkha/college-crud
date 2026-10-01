"use server";

import { db } from "@/db";
import { courses } from "@/db/schema";
import {
  createCourseSchema,
  deleteCourseSchema,
  updateCourseSchema,
} from "@/db/course-validation";
import type { CourseActionState } from "./action-state";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth-session";

function validationFailure(error: z.ZodError): CourseActionState {
  const fieldErrors: CourseActionState["fieldErrors"] = {};

  for (const issue of error.issues) {
    const field = issue.path[0]?.toString() ?? "_form";
    fieldErrors[field] ??= [];
    fieldErrors[field].push(issue.message);
  }

  return {
    status: "error",
    message: "Please correct the highlighted fields.",
    fieldErrors,
  };
}

export async function createCourse(
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const user = await requireUser();
  const result = createCourseSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationFailure(result.error);
  }

  const { title, description, duration, fee } = result.data;

  await db.insert(courses).values({
    title,
    description: description || null,
    duration,
    fee,
    ownerId: user.id,
  });

  revalidatePath("/courses");
  return { status: "success", message: "Course created.", fieldErrors: {} };
}

export async function updateCourse(
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const user = await requireUser();
  const result = updateCourseSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationFailure(result.error);
  }

  const { id, title, description, duration, fee } = result.data;

  await db
    .update(courses)
    .set({
      title,
      description: description || null,
      duration,
      fee,
    })
    .where(and(eq(courses.id, id), eq(courses.ownerId, user.id)));

  revalidatePath("/courses");
  return { status: "success", message: "Course updated.", fieldErrors: {} };
}

export async function deleteCourse(
  _previousState: CourseActionState,
  formData: FormData,
): Promise<CourseActionState> {
  const user = await requireUser();
  const result = deleteCourseSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return validationFailure(result.error);
  }

  await db
    .delete(courses)
    .where(
      and(
        eq(courses.id, result.data.id),
        eq(courses.ownerId, user.id),
      ),
    );

  revalidatePath("/courses");
  return { status: "success", message: "Course deleted.", fieldErrors: {} };
}