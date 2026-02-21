import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateShopForm } from "@/components/CreateShopForm";

export default async function NewShopPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "shopkeeper") {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Create New Shop</h1>
      <CreateShopForm />
    </div>
  );
}
