import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ShopkeeperShopsPage() {
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

  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .eq("shopkeeper_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Shops</h1>
        <Link
          href="/shopkeeper/shops/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Create New Shop
        </Link>
      </div>

      {shops && shops.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {shop.image_url && (
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={shop.image_url}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{shop.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{shop.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>{shop.address}</p>
                  <p>{shop.city}, {shop.state}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/shopkeeper/shops/${shop.id}/products`}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-sm"
                  >
                    Manage Products
                  </Link>
                  <Link
                    href={`/shopkeeper/shops/${shop.id}/edit`}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">You haven't created any shops yet.</p>
          <Link
            href="/shopkeeper/shops/new"
            className="text-blue-600 hover:underline"
          >
            Create Your First Shop →
          </Link>
        </div>
      )}
    </div>
  );
}
