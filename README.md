# 🌶️ Nashik's Best Misal — Directory & Review Platform

Welcome to **Nashik Top Misal**, the premier local food directory, discovery platform, and gamified review web application for Nashik's iconic *Misal Pav* joints!

> For full technical documentation, architecture flow, API specification, and design tokens, see [DOCUMENTATION.md](file:///e:/nashik_top_misal/DOCUMENTATION.md).

---

## 🚀 Quick Start

### 1. Backend (FastAPI + SQLAlchemy)
```bash
cd backend
python -m venv venv
# Activate virtual environment:
# Windows: venv\Scripts\activate
# Linux/Mac: source venv/bin/activate

pip install -r requirements.txt
python seed.py              # Seeds SQLite database with famous spots (Sadhana, Grape Embassy, etc.)
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Frontend (React 18 + Vite + Tailwind CSS)
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## 🛠️ Tech Stack Overview
- **Frontend**: React 18, Vite, React Router v6, React Query v5, Tailwind CSS, Leaflet Maps, Framer Motion, Lucide Icons.
- **Backend**: FastAPI, Python 3.10+, SQLAlchemy 2.0, Pydantic v2, SQLite (`nashik_misal.db`).
- **Creator**: Tejas Thakare (Lead Developer & Website Maker) • PhonePe/UPI: 7058638277
