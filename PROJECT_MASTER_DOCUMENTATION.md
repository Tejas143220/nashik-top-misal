# 🏆 Project Master Documentation — Nashik's Best Misal

Official technical, architectural, and operational documentation for **Nashik's Best Misal** web application.

---

## 📌 1. Project Overview

| Attribute | Details |
| :--- | :--- |
| **Application Name** | Nashik's Best Misal (नाशिकची सर्वोत्कृष्ट मिसळ) |
| **Website Type** | Single-Page Web Application (SPA) Directory & Gamification Platform |
| **Lead Developer & Maker** | **Tejas Thakare** |
| **Developer Contact & UPI** | `7058638277` (PhonePe / GPay / WhatsApp) |
| **Merchant Demo PIN** | `7058` |
| **Target Audience** | Misal foodies, tourists, Nashik locals, and food joint merchants |
| **Repository** | `Tejas143220/nashik-top-misal` |

---

## 🛠️ 2. Technology Stack

### Frontend (User Interface)
- **Core Library**: React 18 with Vite build tool
- **Styling**: Vanilla TailwindCSS with glassmorphism gradients and custom animations
- **Icons**: Lucide React
- **Animations**: Framer Motion & Canvas Confetti
- **State & Router**: React Router DOM v6, React Query, React Context (Auth, Filter, Language)
- **SEO Engine**: React Helmet Async & Schema.org JSON-LD microdata generator

### Backend (API Server)
- **Framework**: Python FastAPI
- **Database**: SQLite / PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT token bearer auth & Merchant PIN verification
- **Validation**: Pydantic schemas
- **Testing**: Python unittest suite (40 test cases passing)

---

## 🚀 3. Core Features Breakdown

### 1. 🔍 SEO-Ranked Directory Search & Zanzanit Filters
- Search by shop name, area (Gangapur Road, Panchavati, College Road, etc.), and spicy level (1 to 5).
- Wood stove cooking filter (**Chulhivarchi 🔥**).
- Dynamic URL slug router (`/misal/sadhana-chulhivarchi-misal-nashik`).

### 2. 📍 "Misal Near Me" Geo-Location Finder
- Real-time GPS distance calculation using the Haversine formula (`geo.js`).
- Computes exact distance from user (`📍 1.2 km away`) with fallback to Nashik City Center.

### 3. 👥 Live Community Queue Check-in & Wait Time Tracker
- Real-time queue check-in modal (`QueueCheckinModal.jsx`).
- Calculates average wait times and live crowd meters (*Low*, *Moderate*, *Crowded*).

### 4. 🤖 12-Domain Misal AI Chatbot NLP Engine
- Interactive AI Assistant (`MisalAIChatbot.jsx`) answering queries about spice levels, budget combos, family gardens, wood stove spots, timings, and history.

### 5. 🤖 Automated Background WhatsApp Developer Alerts
- Automatic background webhook dispatch to developer **Tejas Thakare** (`917058638277`) upon shop submission or sponsorship activation.

### 6. 💳 Dynamic UPI QR Code & 18% GST Tax Invoice Generator
- Scannable dynamic amount UPI QR code generator (`https://api.qrserver.com/v1/create-qr-code/...`).
- Simulated Card/NetBanking 2-Factor OTP modal.
- Printable Official Tax Invoice Receipt with itemized 18% GST calculation (`window.print()`).

### 7. 🏷️ Gamified Nashik Misal Passport
- Users earn stamps and achievement badges (*Zanzanit Warrior 🌶️*, *Chulhi Enthusiast 🔥*).
- Level progression (Level 1 Rookie to Level 4 Legend) with unlocked food vouchers.

---

## 🌐 4. Master Deployment Guide (Vercel & Render)

### 🎨 Vercel (Frontend Deployment)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**:
  - `VITE_API_BASE_URL` = `https://nashik-top-misal-backend.onrender.com/api/v1`

### 🐍 Render (Backend Deployment)
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variable**:
  - `CORS_ORIGINS` = `https://nashik-top-misal.vercel.app,http://localhost:5173`

---

## 🔑 5. Environment Variables Quick Reference

| Environment | Key | Value |
| :--- | :--- | :--- |
| **Vercel (Production)** | `VITE_API_BASE_URL` | `https://nashik-top-misal-backend.onrender.com/api/v1` |
| **Render (Backend)** | `CORS_ORIGINS` | `https://nashik-top-misal.vercel.app,http://localhost:5173` |
| **Render (Backend)** | `SECRET_KEY` | `nashik_misal_super_secret_key_2026_zanzanit` |
| **Local Frontend** | `VITE_API_BASE_URL` | `http://localhost:8000/api/v1` |

---

## 🧪 6. System Health & Quality Audit

- **Backend Unit Tests**: `python run_backend_tests.py` ➔ **40/40 Tests Passed** (0 errors).
- **ESLint Code Quality**: `npx eslint "src/**/*.{js,jsx}"` ➔ **0 Errors, 0 Warnings**.
- **Vite Build Bundle**: `npm run build` ➔ **Clean production build in ~25 seconds**.
- **Error Protection**: Fail-safe mock data fallbacks in `api.js` + `ErrorBoundary` component wrap.
