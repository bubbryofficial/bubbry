import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ShopsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Local Shops</h1>
      
      {shops && shops.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <Link
              key={shop.id}
              href={`/shops/${shop.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
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
                <div className="text-sm text-gray-500">
                  <p>{shop.address}</p>
                  <p>{shop.city}, {shop.state} - {shop.pincode}</p>
                  {shop.phone && <p className="mt-1">📞 {shop.phone}</p>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No shops available at the moment.</p>
        </div>
      )}
    </div>
  );
}
