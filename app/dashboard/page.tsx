import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-4xl mx-auto mt-12">
      <h1 className="text-3xl font-bold mb-4">
        Dashboard
      </h1>

      <p className="text-lg">
        Welcome, {user.email} ✅
      </p>

      <div className="mt-6 p-4 bg-green-100 rounded">
        Your LocalShop dashboard is working.
      </div>
    </div>
  );
}