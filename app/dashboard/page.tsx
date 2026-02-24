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
    <div className="p-10">
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      <p>
        Welcome {user.email}
      </p>
    </div>
  );
}