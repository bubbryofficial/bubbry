import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductSearch } from "@/components/ProductSearch";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Search Products</h1>
      <ProductSearch />
    </div>
  );
}
