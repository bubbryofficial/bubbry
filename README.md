# LocalShop - Local Marketplace Platform

A full-featured marketplace platform for local shopkeepers in India.

## Features

### Customers
- Sign up and login
- Search products
- View shops
- Place pickup or delivery orders

### Shopkeepers
- Sign up and login
- Create shop
- Add products
- Update stock
- View orders

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Authentication & Database)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a new project in [Supabase](https://supabase.com)

2. Go to SQL Editor in your Supabase dashboard

3. Copy and paste the contents of `supabase/schema.sql` into the SQL Editor and run it

4. This will create:
   - User profiles table with role-based access
   - Shops table for shopkeeper shops
   - Products table for shop products
   - Orders and order_items tables for order management
   - Row Level Security (RLS) policies for data protection
   - Automatic profile creation trigger

5. Get your Supabase credentials:
   - Go to Project Settings → API
   - Copy the Project URL and anon/public key
   - Add them to your `.env.local` file

## Project Structure

```
localshop/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   ├── products/          # Product search page
│   ├── shops/             # Shop listing and detail pages
│   ├── orders/            # Customer orders page
│   └── shopkeeper/        # Shopkeeper dashboard and management
├── components/            # React components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client configuration
├── supabase/             # Database schema
└── middleware.ts         # Route protection middleware
```

## Features Overview

### Customer Features
- **Authentication**: Sign up and login with email/password
- **Product Search**: Real-time search across all shops
- **Shop Browsing**: View all active shops with details
- **Order Placement**: Place orders for pickup or delivery with order details
- **Order Tracking**: View order history and status

### Shopkeeper Features
- **Dashboard**: Overview of shops, products, and orders
- **Shop Management**: Create and edit shop details
- **Product Management**: Add products with pricing and stock
- **Stock Updates**: Real-time stock quantity updates
- **Order Management**: View and update order statuses

## Development

The project uses:
- **Next.js 14** with App Router for server-side rendering
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for backend (auth, database, real-time)

All pages are server components by default, with client components used for interactive forms and real-time updates.
