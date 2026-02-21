"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function OrderList({ orders }: { orders: any[] }) {
  const router = useRouter();
  const supabase = createClient();

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      alert("Failed to update order status");
    }
  };

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

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return "confirmed";
      case "confirmed":
        return "preparing";
      case "preparing":
        return "ready";
      case "ready":
        return "completed";
      default:
        return null;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order: any) => {
        const nextStatus = getNextStatus(order.status);
        return (
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
                <p className="text-gray-700 mt-2">
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
                {order.notes && (
                  <p className="text-gray-700">
                    <strong>Notes:</strong> {order.notes}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ₹{parseFloat(order.total_amount).toFixed(2)}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
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

            {nextStatus && (
              <button
                onClick={() => updateOrderStatus(order.id, nextStatus)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
