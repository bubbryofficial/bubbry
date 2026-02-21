import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Sign In</h1>
        <LoginForm />
        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
