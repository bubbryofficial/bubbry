import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      shops (
        id,
        name,
        address,
        city,
        state,
        pincode,
        phone
      ),
      order_items (
        *,
        products (
          id,
          name,
          price
        )
      )
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-purple-100 text-purple-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">My Orders</h1>
      
      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Order #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{parseFloat(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">
                  <strong>Shop:</strong> {order.shops?.name}
                </p>
                <p className="text-gray-700">
                  <strong>Type:</strong> {order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1)}
                </p>
                {order.delivery_address && (
                  <p className="text-gray-700">
                    <strong>Delivery Address:</strong> {order.delivery_address}
                  </p>
                )}
                {order.phone && (
                  <p className="text-gray-700">
                    <strong>Contact:</strong> {order.phone}
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-gray-900">Items:</h4>
                <ul className="space-y-2">
                  {order.order_items?.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-gray-700">
                      <span>
                        {item.products?.name} × {item.quantity}
                      </span>
                      <span>₹{parseFloat(item.price).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link
            href="/shops"
            className="text-blue-600 hover:underline"
          >
            Browse Shops →
          </Link>
        </div>
      )}
    </div>
  );
}
