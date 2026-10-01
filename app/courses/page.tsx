import { db } from "@/db";
import { courses } from "@/db/schema";
import {
  CreateCourseForm,
  DeleteCourseForm,
  UpdateCourseForm,
} from "./course-forms";
import { eq } from "drizzle-orm";
import { requireUser } from "@/lib/auth-session";
import { SignOutButton } from "@/app/sign-out-button";

export default async function CoursesPage() {
  const user = await requireUser();
  const courseList = await db
    .select()
    .from(courses)
    .where(eq(courses.ownerId, user.id));

  return (
    <main className="mx-auto max-w-3xl p-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="mt-1 text-sm text-zinc-600">Signed in as {user.email}</p>
        </div>
        <SignOutButton />
      </header>

      {/* CREATE */}
      <CreateCourseForm />

      {/* READ + UPDATE */}
      <div className="space-y-8">
        {courseList.map((course) => (
          <div key={course.id} className="rounded border p-4">
            <h2 className="mb-4 text-xl font-semibold">
              {course.title}
            </h2>

            <UpdateCourseForm course={course} />
            <DeleteCourseForm courseId={course.id} />
          </div>
        ))}
      </div>
    </main>
  );
}