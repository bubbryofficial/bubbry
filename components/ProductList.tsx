"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function ProductList({ products, shopId }: { products: any[]; shopId: string }) {
  const router = useRouter();
  const supabase = createClient();

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", productId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      alert("Failed to update stock");
    }
  };

  const handleToggleAvailability = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !currentStatus })
        .eq("id", productId);

      if (error) throw error;
      router.refresh();
    } catch (error) {
      alert("Failed to update availability");
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">No products yet. Add your first product!</p>
      </div>
    );
  }

  return (
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
            <div className="mb-4">
              <p className="text-2xl font-bold text-blue-600 mb-2">
                ₹{parseFloat(product.price).toFixed(2)}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm text-gray-700">Stock:</label>
                <input
                  type="number"
                  min="0"
                  value={product.stock_quantity}
                  onChange={(e) => handleStockUpdate(product.id, parseInt(e.target.value) || 0)}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <span className="text-sm text-gray-500">{product.unit}</span>
              </div>
              {product.category && (
                <p className="text-sm text-gray-500">Category: {product.category}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAvailability(product.id, product.is_available)}
                className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                  product.is_available
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                {product.is_available ? "Available" : "Unavailable"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
