import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ShopkeeperDashboard() {
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
    .eq("shopkeeper_id", user.id);

  const shopIds = shops?.map((s) => s.id) || [];

  const { data: orders } = shopIds.length > 0 ? await supabase
    .from("orders")
    .select("*")
    .in("shop_id", shopIds)
    .order("created_at", { ascending: false })
    .limit(10) : { data: null };

  const { data: products } = shopIds.length > 0 ? await supabase
    .from("products")
    .select("*")
    .in("shop_id", shopIds) : { data: null };

  const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Shops</h3>
          <p className="text-3xl font-bold text-blue-600">{shops?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{products?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Pending Orders</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <Link
              href="/shopkeeper/shops/new"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Create New Shop
            </Link>
            <Link
              href="/shopkeeper/shops"
              className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              Manage Shops
            </Link>
            <Link
              href="/shopkeeper/orders"
              className="block w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Orders</h2>
          {orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div key={order.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "completed" ? "bg-green-100 text-green-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  );
}
