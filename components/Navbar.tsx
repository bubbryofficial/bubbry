import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: profile } = user ? await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single() : { data: null };

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LocalShop
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {profile?.role === "customer" ? (
                  <>
                    <Link
                      href="/products"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Products
                    </Link>
                    <Link
                      href="/shops"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Shops
                    </Link>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      My Orders
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/shopkeeper/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/shopkeeper/shops"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      My Shops
                    </Link>
                    <Link
                      href="/shopkeeper/orders"
                      className="text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Orders
                    </Link>
                  </>
                )}
                <form action={signOut}>
                  <button
                    type="submit"
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
