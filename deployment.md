# PropTech-Nexus v2 Deployment Guide

## 1. Supabase (Database & Cloud)
1. Navigate to the Supabase SQL Editor.
2. Execute `database/schema.sql` to initialize the database shield and the critical PostGIS schemas (`Geometry(Point)` & `Geometry(Polygon)`).
3. Execute `database/rls_policies.sql` to securely lock down tables, preventing any unauthorized writes to your core architecture.
4. Retrieve your **Project URL** and **Service Role Key** from Settings > API.
   * > **[WARNING]** Do NOT use the public `anon` key for the FastAPI backend; you must use the `service_role` key to bypass RLS policies and perform the autonomous ingestion writes securely.

## 2. Railway (FastAPI Backend Microservice)
1. Connect your GitHub repository to [Railway](https://railway.app/).
2. Set the root directory of the deployment to `/backend`.
3. Railway will automatically detect the optimized `Dockerfile` and securely build the image with the necessary `playwright` Chromium dependencies.
4. Inject the following **Environment Variables**:
   - `DATABASE_URL`: Your Supabase connection string (We highly recommend using the IPv4 Transaction Pooler connection string).
   - `REDIS_URL`: Your Redis instance URL (Provision a Redis plugin dynamically via Railway).
   - `MAPBOX_TOKEN`: Your Mapbox Geocoding API Key.
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `RATE_LIMIT_REQUESTS`: 100
   - `RATE_LIMIT_WINDOW`: 60

## 3. Vercel (Next.js Frontend UI)
1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. Set the root directory to `/frontend`.
3. Vercel will instantly recognize the Next.js 15 App Router structure and optimize static edge assets.
4. Inject the following **Environment Variables**:
   - `DATABASE_URL`: Your Supabase connection string (Needed for `drizzle-orm` server components).
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Your Mapbox GL JS rendering token.
   - `NEXT_PUBLIC_BACKEND_URL`: The active deployment URL of your Railway FastAPI service (e.g., `https://proptech-backend.up.railway.app`).

## 4. Final Security Verification
- Ensure that no `.env` files were accidentally committed to your repository. The included `.gitignore` provides absolute safeguards against this.
- To verify the **Supabase RLS** is functioning properly, attempt to run an `INSERT INTO properties (address, geom, price...);` query using your public anon key. It must return a `403 Forbidden` response.
