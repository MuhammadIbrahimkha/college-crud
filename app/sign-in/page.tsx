import { AuthForm } from "@/app/auth-form";
import { getCurrentSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  if (await getCurrentSession()) {
    redirect("/courses");
  }

  return <AuthForm mode="sign-in" />;
}