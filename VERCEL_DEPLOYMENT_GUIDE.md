# 🚀 Step-by-Step Vercel Deployment Guide — Nashik's Best Misal

This guide provides the complete, step-by-step instructions to deploy **Nashik's Best Misal** web application to **Vercel** for 100% free hosting with zero blank-screen errors.

---

## 📌 Option 1: Deploying via Vercel Dashboard (Recommended & Easiest)

### Step 1: Push Project Code to GitHub
1. Open your terminal in VS Code and ensure all your latest changes are committed:
   ```bash
   git add .
   git commit -m "Deploy: Vercel SPA rewrites and fail-safe API fallbacks"
   git push origin main
   ```

---

### Step 2: Import Repository on Vercel
1. Log in to your **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Click the **"Add New..."** button in the top right corner and select **"Project"**.
3. Under **Import Git Repository**, select your GitHub repository: `Tejas143220/nashik-top-misal`.

---

### Step 3: Configure Project Build Settings on Vercel
On the **Configure Project** screen, configure the following settings:

| Setting Field | Recommended Value | Note |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Vercel will auto-detect Vite |
| **Root Directory** | `frontend` | ⚠️ **IMPORTANT**: Click *Edit* and select the `frontend` folder |
| **Build Command** | `npm run build` | Default Vite build command |
| **Output Directory** | `dist` | Default Vite output directory |
| **Install Command** | `npm install` | Default package installation |

---

### Step 4: Environment Variables (Optional)
If your FastAPI backend is hosted live on Render or Railway (e.g. `https://nashik-top-misal.onrender.com`), expand **Environment Variables** and add:

- **Key**: `VITE_API_BASE_URL`
- **Value**: `https://nashik-top-misal.onrender.com/api/v1` *(or your live backend URL)*

> *Note: If no backend URL is provided, the website will automatically run using built-in fail-safe Nashik misal data without going blank!*

---

### Step 5: Click "Deploy"
1. Click the **"Deploy"** button.
2. Vercel will build your Vite application in ~35 seconds and generate your live production URL:  
   👉 `https://nashik-top-misal.vercel.app`

---

## 💻 Option 2: Deploying via Vercel CLI (Command Line)

If you prefer deploying directly from your VS Code terminal:

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Log in to Vercel
```bash
vercel login
```

### Step 3: Run Deployment Command
Navigate to the `frontend` folder and deploy:
```bash
cd frontend
vercel --prod
```

1. Select **"Y"** to set up and deploy.
2. Select your Vercel scope/account.
3. Link to existing project? **"N"** (for new deployment).
4. Project Name: `nashik-top-misal`.
5. Code located at `./`? Press **Enter**.
6. Auto-detected settings: Press **Enter** to confirm.

Vercel will output your live URL immediately!

---

## ⚙️ How Vercel Configuration Keeps Your Site Live (`vercel.json`)

Your project includes a pre-configured `vercel.json` file inside `frontend/vercel.json`:

```json
{
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://nashik-top-misal.onrender.com/api/v1/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Why this prevents blank screen errors:
- **`/(.*) -> /index.html`**: Handles single-page application (SPA) client-side routing (`/directory`, `/passport`, `/misal/sadhana...`) so refreshing the page never returns a 404 or blank screen.
- **`/api/v1/:path*`**: Automatically proxies API calls to your backend server without CORS issues.

---

## 🐍 Bonus: Deploying FastAPI Backend (Optional)

To deploy your Python FastAPI backend (`backend/`):
1. **Host on Render (Free)**: Import the `backend/` folder on [Render.com](https://render.com), set build command `pip install -r requirements.txt`, and start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
2. Add your Render URL to Vercel environment variable `VITE_API_BASE_URL`.
