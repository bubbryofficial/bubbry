import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to LocalShop
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your local marketplace connecting customers with neighborhood shopkeepers.
          Shop local, support local!
        </p>
        {!user ? (
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/shops"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Shops
            </Link>
            <Link
              href="/products"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Search Products
            </Link>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8 py-16 px-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">For Customers</h3>
          <p className="text-gray-600 mb-4">
            Discover local shops, search products, and place orders for pickup or delivery.
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Easy product search</li>
            <li>✓ Browse local shops</li>
            <li>✓ Quick ordering</li>
            <li>✓ Track your orders</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">For Shopkeepers</h3>
          <p className="text-gray-600 mb-4">
            Manage your shop, add products, update stock, and handle orders all in one place.
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Create your shop</li>
            <li>✓ Manage products</li>
            <li>✓ Update inventory</li>
            <li>✓ View orders</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Local Focus</h3>
          <p className="text-gray-600 mb-4">
            Supporting local businesses and strengthening community connections.
          </p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>✓ Support local economy</li>
            <li>✓ Quick delivery</li>
            <li>✓ Personal service</li>
            <li>✓ Community building</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
