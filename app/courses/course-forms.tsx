"use client";

import { useActionState } from "react";
import { createCourse, deleteCourse, updateCourse } from "./actions";
import { initialCourseActionState } from "./action-state";
import type { courses } from "@/db/schema";

type Course = typeof courses.$inferSelect;

function FieldError({
  field,
  errors,
}: {
  field: string;
  errors: Record<string, string[]>;
}) {
  const message = errors[field]?.[0];

  if (!message) return null;

  return (
    <p id={`${field}-error`} className="text-sm text-red-700" role="alert">
      {message}
    </p>
  );
}

function ActionMessage({
  status,
  message,
}: {
  status: "idle" | "success" | "error";
  message: string;
}) {
  if (status === "idle" || !message) return null;

  return (
    <p
      className={status === "error" ? "text-sm text-red-700" : "text-sm text-green-700"}
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </p>
  );
}

export function CreateCourseForm() {
  const [state, formAction, pending] = useActionState(
    createCourse,
    initialCourseActionState,
  );

  return (
    <form action={formAction} className="mb-10 space-y-4">
      <div>
        <input
          name="title"
          placeholder="Course title"
          className="w-full rounded border p-2"
          required
          aria-invalid={Boolean(state.fieldErrors.title)}
          aria-describedby={state.fieldErrors.title ? "title-error" : undefined}
        />
        <FieldError field="title" errors={state.fieldErrors} />
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          className="w-full rounded border p-2"
          aria-invalid={Boolean(state.fieldErrors.description)}
          aria-describedby={state.fieldErrors.description ? "description-error" : undefined}
        />
        <FieldError field="description" errors={state.fieldErrors} />
      </div>

      <div>
        <input
          name="duration"
          placeholder="e.g. 3 months"
          className="w-full rounded border p-2"
          required
          aria-invalid={Boolean(state.fieldErrors.duration)}
          aria-describedby={state.fieldErrors.duration ? "duration-error" : undefined}
        />
        <FieldError field="duration" errors={state.fieldErrors} />
      </div>

      <div>
        <input
          name="fee"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Fee"
          className="w-full rounded border p-2"
          required
          aria-invalid={Boolean(state.fieldErrors.fee)}
          aria-describedby={state.fieldErrors.fee ? "fee-error" : undefined}
        />
        <FieldError field="fee" errors={state.fieldErrors} />
      </div>

      <ActionMessage status={state.status} message={state.message} />

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create Course"}
      </button>
    </form>
  );
}

export function UpdateCourseForm({ course }: { course: Course }) {
  const [state, formAction, pending] = useActionState(
    updateCourse,
    initialCourseActionState,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="id" value={course.id} />

      <div>
        <input
          name="title"
          defaultValue={course.title}
          className="w-full rounded border p-2"
          required
          aria-invalid={Boolean(state.fieldErrors.title)}
          aria-describedby={state.fieldErrors.title ? `title-${course.id}-error` : undefined}
        />
        {state.fieldErrors.title?.[0] && (
          <p id={`title-${course.id}-error`} className="text-sm text-red-700" role="alert">
            {state.fieldErrors.title[0]}
          </p>
        )}
      </div>

      <div>
        <textarea
          name="description"
          defaultValue={course.description ?? ""}
          className="w-full rounded border p-2"
          aria-invalid={Boolean(state.fieldErrors.description)}
          aria-describedby={state.fieldErrors.description ? `description-${course.id}-error` : undefined}
        />
        {state.fieldErrors.description?.[0] && (
          <p id={`description-${course.id}-error`} className="text-sm text-red-700" role="alert">
            {state.fieldErrors.description[0]}
          </p>
        )}
      </div>

      <div>
        <input
          name="duration"
          defaultValue={course.duration}
          className="w-full rounded border p-2"
          required
          aria-invalid={Boolean(state.fieldErrors.duration)}
          aria-describedby={state.fieldErrors.duration ? `duration-${course.id}-error` : undefined}
        />
        {state.fieldErrors.duration?.[0] && (
          <p id={`duration-${course.id}-error`} className="text-sm text-red-700" role="alert">
            {state.fieldErrors.duration[0]}
          </p>
        )}
      </div>

      <div>
        <input
          name="fee"
          type="number"
          min="0.01"
          step="0.01"
          defaultValue={course.fee}
          className="w-full rounded border p-2"
          required
          aria-invalid={Boolean(state.fieldErrors.fee)}
          aria-describedby={state.fieldErrors.fee ? `fee-${course.id}-error` : undefined}
        />
        {state.fieldErrors.fee?.[0] && (
          <p id={`fee-${course.id}-error`} className="text-sm text-red-700" role="alert">
            {state.fieldErrors.fee[0]}
          </p>
        )}
      </div>

      <ActionMessage status={state.status} message={state.message} />

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Updating..." : "Update Course"}
      </button>
    </form>
  );
}

export function DeleteCourseForm({ courseId }: { courseId: number }) {
  const [state, formAction, pending] = useActionState(
    deleteCourse,
    initialCourseActionState,
  );

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="id" value={courseId} />
      <ActionMessage status={state.status} message={state.message} />
      <FieldError field="id" errors={state.fieldErrors} />
      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-white disabled:opacity-60"
      >
        {pending ? "Deleting..." : "Delete Course"}
      </button>
    </form>
  );
}