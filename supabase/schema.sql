-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('customer', 'shopkeeper');

-- Order status enum
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled');

-- Order type enum
CREATE TYPE order_type AS ENUM ('pickup', 'delivery');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Shops table
CREATE TABLE public.shops (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shopkeeper_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Products table
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0 NOT NULL,
  unit TEXT DEFAULT 'piece',
  image_url TEXT,
  category TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Orders table
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  order_type order_type NOT NULL,
  status order_status DEFAULT 'pending' NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for better query performance
CREATE INDEX idx_shops_shopkeeper_id ON public.shops(shopkeeper_id);
CREATE INDEX idx_shops_city ON public.shops(city);
CREATE INDEX idx_products_shop_id ON public.products(shop_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_shop_id ON public.orders(shop_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Shops policies
CREATE POLICY "Anyone can view active shops"
  ON public.shops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Shopkeepers can view their own shops"
  ON public.shops FOR SELECT
  USING (auth.uid() = shopkeeper_id);

CREATE POLICY "Shopkeepers can create shops"
  ON public.shops FOR INSERT
  WITH CHECK (auth.uid() = shopkeeper_id);

CREATE POLICY "Shopkeepers can update their own shops"
  ON public.shops FOR UPDATE
  USING (auth.uid() = shopkeeper_id);

-- Products policies
CREATE POLICY "Anyone can view available products"
  ON public.products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Shopkeepers can view products from their shops"
  ON public.products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

CREATE POLICY "Shopkeepers can create products in their shops"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

CREATE POLICY "Shopkeepers can update products in their shops"
  ON public.products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

-- Orders policies
CREATE POLICY "Customers can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = customer_id);

CREATE POLICY "Shopkeepers can view orders for their shops"
  ON public.orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = orders.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Shopkeepers can update orders for their shops"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = orders.shop_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

-- Order items policies
CREATE POLICY "Users can view order items for their orders"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "Shopkeepers can view order items for their shop orders"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.shops ON shops.id = orders.shop_id
      WHERE orders.id = order_items.order_id
      AND shops.shopkeeper_id = auth.uid()
    )
  );

CREATE POLICY "Customers can create order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );
