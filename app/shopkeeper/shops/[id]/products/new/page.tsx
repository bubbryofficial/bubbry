import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CreateProductForm } from "@/components/CreateProductForm";

export default async function NewProductPage({
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
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Add New Product</h1>
      <CreateProductForm shopId={params.id} />
    </div>
  );
}
