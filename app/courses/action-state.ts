export type CourseActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Record<string, string[]>;
};

export const initialCourseActionState: CourseActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};