import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProductList } from "@/components/ProductList";

export default async function ShopProductsPage({
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

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            href="/shopkeeper/shops"
            className="text-blue-600 hover:underline mb-2 inline-block"
          >
            ← Back to Shops
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{shop.name} - Products</h1>
        </div>
        <Link
          href={`/shopkeeper/shops/${params.id}/products/new`}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Add Product
        </Link>
      </div>

      <ProductList products={products || []} shopId={params.id} />
    </div>
  );
}
