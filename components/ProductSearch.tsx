"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";

export function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setProducts([]);
        return;
      }

      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select(`
          *,
          shops (
            id,
            name,
            address,
            city,
            state
          )
        `)
        .eq("is_available", true)
        .ilike("name", `%${searchTerm}%`)
        .limit(20);

      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for products..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        />
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-600">Searching...</div>
      )}

      {!loading && searchTerm.length >= 2 && products.length === 0 && (
        <div className="text-center py-8 text-gray-600">
          No products found matching "{searchTerm}"
        </div>
      )}

      {!loading && products.length > 0 && (
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
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <Link
                  href={`/shops/${product.shops?.id}`}
                  className="text-blue-600 text-sm hover:underline mb-3 inline-block"
                >
                  {product.shops?.name} - {product.shops?.city}
                </Link>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.stock_quantity} {product.unit} available
                  </span>
                </div>
                <AddToCartButton product={product} shopId={product.shops?.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
