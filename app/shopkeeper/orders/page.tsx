import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrderList } from "@/components/OrderList";

export default async function ShopkeeperOrdersPage() {
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
    .select("id")
    .eq("shopkeeper_id", user.id);

  const shopIds = shops?.map((s) => s.id) || [];

  const { data: orders } = shopIds.length > 0 ? await supabase
    .from("orders")
    .select(`
      *,
      shops (
        id,
        name
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
    .in("shop_id", shopIds)
    .order("created_at", { ascending: false }) : { data: null };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Orders</h1>
      <OrderList orders={orders || []} />
    </div>
  );
}
