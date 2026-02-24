// app/dashboard/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user || error) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard
      </h1>

      <p className="text-lg mb-4">
        Welcome, {user.email}
      </p>

      <div className="bg-green-100 p-4 rounded-lg">
        ✅ Login successful. Your dashboard is working.
      </div>
    </div>
  );
}