import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ShopDetailPage({
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
    .single();

  if (!shop) {
    return (
      <div className="max-w-6xl mx-auto">
        <p className="text-red-600">Shop not found.</p>
      </div>
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("shop_id", params.id)
    .eq("is_available", true)
    .order("name");

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        href="/shops"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Shops
      </Link>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {shop.image_url && (
          <img
            src={shop.image_url}
            alt={shop.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{shop.name}</h1>
        <p className="text-gray-600 mb-4">{shop.description}</p>
        <div className="text-gray-700">
          <p className="mb-1"><strong>Address:</strong> {shop.address}</p>
          <p className="mb-1"><strong>City:</strong> {shop.city}, {shop.state} - {shop.pincode}</p>
          {shop.phone && <p className="mb-1"><strong>Phone:</strong> {shop.phone}</p>}
          {shop.email && <p><strong>Email:</strong> {shop.email}</p>}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-gray-900">Products</h2>
      
      {products && products.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {product.image_url && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock_quantity} {product.unit} available
                  </span>
                </div>
                <AddToCartButton product={product} shopId={shop.id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No products available in this shop.</p>
        </div>
      )}
    </div>
  );
}
