"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function AddToCartButton({ product, shopId }: { product: any; shopId: string }) {
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Please sign in to place an order");
      }

      const totalAmount = parseFloat(product.price) * quantity;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          shop_id: shopId,
          order_type: orderType,
          total_amount: totalAmount,
          delivery_address: orderType === "delivery" ? deliveryAddress : null,
          phone: phone || null,
          notes: notes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: product.id,
          quantity: quantity,
          price: parseFloat(product.price),
        });

      if (itemsError) throw itemsError;

      // Update product stock
      const { error: stockError } = await supabase
        .from("products")
        .update({
          stock_quantity: product.stock_quantity - quantity,
        })
        .eq("id", product.id);

      if (stockError) throw stockError;

      router.push("/orders");
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!showOrderForm) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-4 py-1 border border-gray-300 rounded min-w-[60px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100"
            disabled={quantity >= product.stock_quantity}
          >
            +
          </button>
        </div>
        <button
          onClick={() => setShowOrderForm(true)}
          disabled={product.stock_quantity === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {product.stock_quantity === 0 ? "Out of Stock" : "Place Order"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleOrder} className="space-y-3">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Order Type
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="pickup"
              checked={orderType === "pickup"}
              onChange={(e) => setOrderType(e.target.value as "pickup" | "delivery")}
              className="mr-2"
            />
            Pickup
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="delivery"
              checked={orderType === "delivery"}
              onChange={(e) => setOrderType(e.target.value as "pickup" | "delivery")}
              className="mr-2"
            />
            Delivery
          </label>
        </div>
      </div>

      {orderType === "delivery" && (
        <div>
          <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
          </label>
          <textarea
            id="deliveryAddress"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required={orderType === "delivery"}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows={2}
          />
        </div>
      )}

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          placeholder="+91 1234567890"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={2}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowOrderForm(false)}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Placing..." : `Order (₹${(parseFloat(product.price) * quantity).toFixed(2)})`}
        </button>
      </div>
    </form>
  );
}
