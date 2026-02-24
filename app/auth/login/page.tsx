import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (

    <div>

      <h1>Login</h1>

      <LoginForm />

    </div>

  );

}