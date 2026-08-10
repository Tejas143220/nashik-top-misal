# 🌐 Full Step-by-Step Hosting Guide — Vercel (Frontend) & Render (Backend)

This complete master guide provides the exact step-by-step process to deploy your full-stack web application **Nashik's Best Misal**:
- 🎨 **Frontend (React + Vite)** ➔ Hosted on **Vercel** (Free)
- 🐍 **Backend (Python + FastAPI)** ➔ Hosted on **Render** (Free)

---

## 📑 Table of Contents
1. [Phase 1: Deploy Backend to Render](#phase-1-deploy-backend-to-render)
2. [Phase 2: Deploy Frontend to Vercel](#phase-2-deploy-frontend-to-vercel)
3. [Phase 3: Connect Vercel ↔ Render](#phase-3-connect-vercel--render)
4. [Phase 4: Verification & Final Audit](#phase-4-verification--final-audit)

---

## 🐍 Phase 1: Deploy Backend to Render

Render will host your FastAPI Python backend (`backend/` directory) and serve database endpoints `/api/v1/...`.

### Step 1.1: Push Code to GitHub
Open VS Code terminal and make sure all changes are pushed:
```bash
git add .
git commit -m "Deployment ready: Render backend & Vercel frontend"
git push origin main
```

---

### Step 1.2: Create New Web Service on Render
1. Log in to your **[Render Dashboard](https://dashboard.render.com)**.
2. Click **"New +"** in the top right and select **"Web Service"**.
3. Choose **"Build and deploy from a Git repository"** and click **Next**.
4. Connect your GitHub account and select repository: `Tejas143220/nashik-top-misal`.

---

### Step 1.3: Configure Render Settings
On the Render Web Service configuration page, set the following exact values:

| Field Name | Setting Value | Notes |
| :--- | :--- | :--- |
| **Name** | `nashik-top-misal-backend` | Your backend app name |
| **Region** | `Singapore (ap-southeast-1)` | Lowest latency for India |
| **Branch** | `main` | Production branch |
| **Root Directory** | `backend` | ⚠️ **MUST BE `backend`** |
| **Runtime** | `Python 3` | Auto-detected |
| **Build Command** | `pip install -r requirements.txt` | Installs FastAPI, SQLAlchemy, Uvicorn |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` | Starts production server |
| **Instance Type** | `Free` | $0/month free tier |

---

### Step 1.4: Add Environment Variables on Render
Scroll down to **Environment Variables** and click **Add Environment Variable**:

- **Key**: `CORS_ORIGINS`
- **Value**: `https://nashik-top-misal.vercel.app,http://localhost:5173`

Click **"Create Web Service"**.

---

### Step 1.5: Get Your Render Backend URL
After 2-3 minutes, Render will output your live API URL at the top of the dashboard:  
👉 `https://nashik-top-misal-backend.onrender.com`

Test it by visiting:  
`https://nashik-top-misal-backend.onrender.com/docs`  
*(You will see the official Swagger OpenAPI docs!)*

---

## 🎨 Phase 2: Deploy Frontend to Vercel

Vercel will host your Vite React frontend (`frontend/` directory).

### Step 2.1: Import Project on Vercel
1. Log in to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click **"Add New..."** ➔ **"Project"**.
3. Under **Import Git Repository**, select `Tejas143220/nashik-top-misal`.

---

### Step 2.2: Configure Vercel Project Settings

Configure these exact settings:

| Setting Field | Value | Notes |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Auto-detected |
| **Root Directory** | `frontend` | ⚠️ **Click Edit and select `frontend`** |
| **Build Command** | `npm run build` | Builds production bundle |
| **Output Directory** | `dist` | Production dist folder |
| **Install Command** | `npm install` | Dependency installation |

---

### Step 2.3: Set Environment Variable on Vercel
Expand **Environment Variables** section and add:

- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://nashik-top-misal-backend.onrender.com/api/v1` *(Your Render URL from Step 1.5)*

---

### Step 2.4: Deploy Frontend
1. Click **"Deploy"**.
2. Vercel will compile your application in ~35 seconds and generate your live website URL:  
   👉 `https://nashik-top-misal.vercel.app`

---

## 🔗 Phase 3: Connect Vercel ↔ Render

To ensure Vercel frontend and Render backend talk to each other without CORS issues:

1. In your `frontend/vercel.json` file (already included in your codebase):
```json
{
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://nashik-top-misal-backend.onrender.com/api/v1/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. If you update your Vercel custom domain (e.g. `https://nashikmisal.in`), update `CORS_ORIGINS` in Render environment variables to include your new domain.

---

## 🧪 Phase 4: Verification Checklist

| Test Item | Verification Action | Expected Result |
| :--- | :--- | :--- |
| **Homepage Load** | Open `https://nashik-top-misal.vercel.app` | 4K Hero Misal image loads cleanly |
| **Directory Search** | Visit `/directory` | Misal shops list loads from Render API |
| **Shop Detail** | Click any shop card | Detail page & crowd meter loads |
| **WhatsApp Alert** | Submit a new shop at `/submit-shop` | Instant WhatsApp alert to Tejas (7058638277) opens |
| **Passport Stamps** | Visit `/passport` | User badge rank level 1-4 renders |
| **Page Refresh** | Press F5 on `/directory` | Page reloads smoothly without 404/blank screen |
