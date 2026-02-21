"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function CreateProductForm({ shopId }: { shopId: string }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "0",
    unit: "piece",
    category: "",
    image_url: "",
    is_available: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("products")
        .insert({
          ...formData,
          shop_id: shopId,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
        });

      if (insertError) throw insertError;

      router.push(`/shopkeeper/shops/${shopId}/products`);
      router.refresh();
    } catch (error: any) {
      setError(error.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Product Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹) *
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity *
          </label>
          <input
            id="stock_quantity"
            type="number"
            min="0"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit *
          </label>
          <select
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="piece">Piece</option>
            <option value="kg">Kilogram</option>
            <option value="gram">Gram</option>
            <option value="liter">Liter</option>
            <option value="packet">Packet</option>
            <option value="dozen">Dozen</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            id="category"
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Grocery, Electronics"
          />
        </div>
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          id="image_url"
          type="url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm font-medium text-gray-700">Product is available</span>
        </label>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
