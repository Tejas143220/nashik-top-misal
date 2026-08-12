# 🚀 Production Deployment Guide - Nashik Top Misal

This guide provides step-by-step instructions for deploying the **Nashik Top Misal** web application live to production.

---

## 🗄️ Step 1: Database (Supabase Cloud PostgreSQL) - COMPLETED ✅

Your PostgreSQL database is hosted on **Supabase**:
- **Host**: `db.imxvoikwatnvstykcawa.supabase.co`
- **Database Name**: `postgres`
- **Security**: Row Level Security (RLS) is enabled on all 15 tables.

---

## ⚙️ Step 2: Deploy Backend API (FastAPI) to Render / Railway

### Option A: Render.com (Recommended - Free Tier)

1. Sign in to **[Render.com](https://render.com)**.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `Tejas143220/nashik-top_misal`.
4. Configure service settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add **Environment Variable**:
   - `DATABASE_URL` = `postgresql://postgres:Tejas%40143220@db.imxvoikwatnvstykcawa.supabase.co:5432/postgres`
6. Click **Create Web Service**.
7. Copy your live backend URL (e.g. `https://nashik-misal-api.onrender.com`).

---

## 💻 Step 3: Deploy Frontend (React + Vite) to Vercel

### Option A: Vercel (Recommended - Free Tier)

1. Sign in to **[Vercel.com](https://vercel.com)**.
2. Click **Add New** -> **Project**.
3. Import your repository: `Tejas143220/nashik-top_misal`.
4. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variable**:
   - `VITE_API_URL` = `https://nashik-misal-api.onrender.com/api/v1` *(replace with your Render backend URL)*
6. Click **Deploy**.
7. Assign your custom domain (e.g. `nashiktopmisal.com`).

---

## 🧪 Step 4: Post-Deployment Verification

After deployment, verify that:
1. `https://your-frontend-domain.vercel.app` loads the homepage.
2. Misal spots load live from Supabase Cloud PostgreSQL.
3. Clicking **Map**, **Dark Mode**, and **WhatsApp Share** works seamlessly.
4. Ratings and reviews submit cleanly to Supabase.
