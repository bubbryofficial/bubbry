import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditShopForm } from "@/components/EditShopForm";

export default async function EditShopPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("id", params.id)
    .eq("shopkeeper_id", user.id)
    .single();

  if (!shop) {
    redirect("/shopkeeper/shops");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Edit Shop</h1>
      <EditShopForm shop={shop} />
    </div>
  );
}
