<div align="center">

<img src="https://img.shields.io/badge/SiteForge_AI-v0.1.0-0ea5e9?style=for-the-badge&logo=sparkles&logoColor=white" alt="SiteForge AI" />

# ⚡ SiteForge AI

### Generate stunning websites instantly — just describe your idea.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
  <img src="https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-deployment">Deployment</a>
</p>

<p align="center">
  🌐 <strong>Live Demo</strong>: <a href="https://siteforge-ai-ten.vercel.app">siteforge-ai-ten.vercel.app</a> &nbsp;•&nbsp;
  🔗 <strong>API Docs</strong>: <a href="https://siteforge-ai-5p5i.onrender.com/docs">siteforge-ai-5p5i.onrender.com/docs</a>
</p>

</div>

---

## 🎯 What is SiteForge AI?

**SiteForge AI** is a full-stack AI-powered website generator. Describe any website in plain English and get a complete, structured, responsive website — with navbar, hero, features, image gallery, contact form, and footer — generated in seconds using GPT-4o-mini via the OpenAI API.

> *"A modern SaaS landing page for a project management tool"* → Full website, instantly.

---

## ✨ Features

- 🤖 **AI Generation** — Powered by GPT-4o-mini via OpenAI API
- ✏️ **Inline Editing** — Click any text in the preview to edit it directly
- 🖼 **Image Gallery** — AI-generated gallery with lightbox viewer
- 📬 **Contact Form** — Fully functional contact form section
- 📦 **Export to ZIP** — Download complete HTML/CSS/JS files ready to deploy
- 🗂 **Project History** — All generated websites saved to MongoDB
- ⚡ **~5-10s Generation** — Fast, real-time feedback with loading phases
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🔒 **Production Ready** — Rate limiting, input validation, error handling, structured logging

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework |
| TypeScript 5 | Type safety |
| Tailwind CSS 3 | Styling |
| Axios | HTTP client |
| Syne + DM Sans | Typography |

### Backend
| Technology | Purpose |
|---|---|
| FastAPI | API framework |
| OpenAI API | AI generation |
| GPT-4o-mini | LLM model |
| Pydantic v2 | Data validation |
| Motor (async) | MongoDB driver |
| Tenacity | Retry logic |
| structlog | Structured logging |
| slowapi | Rate limiting |
| Uvicorn + Gunicorn | ASGI server |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Project storage |
| Motor | Async MongoDB driver |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)
- **MongoDB Atlas** — [Free cluster here](https://cloud.mongodb.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/sheihan-javaid/siteforge-ai.git
cd siteforge-ai
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

Create `backend/.env`:

```env
ENVIRONMENT=development
OPENAI_API_KEY=sk-proj-your-key-here
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/siteforge?appName=Cluster0
MONGODB_DB_NAME=siteforge
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

Backend runs at → `http://localhost:8000`
API docs at → `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at → `http://localhost:3000`

---

## 📁 Project Structure

```
siteforge-ai/
├── frontend/                          # Next.js App
│   └── src/
│       ├── app/
│       │   ├── page.tsx               # Main UI (generator + preview)
│       │   ├── layout.tsx             # Root layout (fonts, metadata)
│       │   └── globals.css            # Global styles + design tokens
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx         # Generated navbar with inline editing
│       │   │   └── Footer.tsx         # Generated footer with inline editing
│       │   ├── sections/
│       │   │   ├── Hero.tsx           # Generated hero with inline editing
│       │   │   ├── Features.tsx       # Generated features with inline editing
│       │   │   ├── Gallery.tsx        # Image gallery with lightbox
│       │   │   └── ContactFormSection.tsx  # Contact form
│       │   ├── ui/
│       │   │   ├── Button.tsx         # Reusable button component
│       │   │   └── EditableText.tsx   # Click-to-edit text component
│       │   ├── WebsitePreview.tsx     # Preview orchestrator with editing
│       │   └── ServerPing.tsx         # Render cold start prevention
│       ├── hooks/
│       │   ├── useGenerate.ts         # Generation state hook
│       │   └── useEditableWebsite.ts  # Inline editing state hook
│       ├── lib/
│       │   ├── api.ts                 # Axios client + all API calls
│       │   └── utils.ts               # cn() utility
│       └── types/
│           └── website.ts             # TypeScript interfaces
│
└── backend/                           # FastAPI App
    └── app/
        ├── main.py                    # App factory + middleware
        ├── core/
        │   ├── config.py              # Pydantic settings
        │   ├── database.py            # MongoDB connection
        │   └── logger.py              # Structured logging
        ├── routes/
        │   ├── generate.py            # POST /v1/generate/generate
        │   ├── export.py              # POST /v1/export/export
        │   ├── projects.py            # CRUD /v1/projects/
        │   ├── health.py              # GET  /v1/health
        │   └── templates.py           # GET  /v1/templates
        ├── services/
        │   ├── llm_service.py         # OpenAI integration
        │   └── template_service.py    # Fallback enhancer
        ├── schemas/
        │   └── website_schema.py      # Pydantic website models
        └── utils/
            ├── parser.py              # LLM JSON parser
            └── validator.py           # Website validator
```

---

## 📡 API Reference

### Generate Website

```http
POST /v1/generate/generate
Content-Type: application/json
```

**Request**
```json
{ "prompt": "A SaaS landing page for a project management tool" }
```

**Response**
```json
{
  "status": "success",
  "data": {
    "navbar": { "logo": "ProjectFlow", "links": ["Home", "Features", "Pricing"] },
    "hero": { "title": "Manage Projects Effortlessly", "subtitle": "...", "cta": "Get Started" },
    "features": [{ "title": "...", "description": "...", "icon": "🚀" }],
    "gallery": [{ "url": "https://picsum.photos/seed/work/600/400", "alt": "...", "caption": "..." }],
    "contact": { "title": "Get In Touch", "fields": [...], "submit_label": "Send Message" },
    "footer": { "text": "© 2026 ProjectFlow. All rights reserved.", "social": ["twitter", "github"] }
  }
}
```

### Export Website

```http
POST /v1/export/export
Content-Type: application/json
```

Returns a downloadable ZIP containing `index.html`, `styles.css`, `script.js`, `README.txt`.

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/projects/` | List all saved projects |
| `POST` | `/v1/projects/` | Save a project |
| `GET` | `/v1/projects/{id}` | Get a project by ID |
| `DELETE` | `/v1/projects/{id}` | Delete a project |

### Health Check

```http
GET /v1/health
```

```json
{ "status": "ok" }
```

### Error Responses

| Status | Meaning |
|---|---|
| `422` | Invalid prompt (too short/long) |
| `429` | Rate limit exceeded (10 req/min) |
| `502` | OpenAI API error |
| `504` | Request timed out |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ENVIRONMENT` | No | `development` or `production` (default: `development`) |
| `OPENAI_API_KEY` | **Yes** | Your OpenAI API key |
| `MONGODB_URL` | **Yes** | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | No | Database name (default: `siteforge`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:8000`) |

---

## 🚢 Deployment

### Backend → Render

**Root Directory:** `backend`

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

**Environment Variables in Render dashboard:**
```env
ENVIRONMENT=production
OPENAI_API_KEY=sk-proj-...
MONGODB_URL=mongodb+srv://...
MONGODB_DB_NAME=siteforge
```

### Frontend → Vercel

**Root Directory:** `frontend`
**Framework:** Next.js
**Build Command:** `npm run build`

**Environment Variable in Vercel dashboard:**
```env
NEXT_PUBLIC_API_URL=https://siteforge-ai-5p5i.onrender.com
```

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The app automatically pings the backend on page load to minimize cold start delays.

---

## 🛡 Security

- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Input validation (min 10, max 2000 characters)
- ✅ CORS restricted to known origins in production
- ✅ API docs disabled in production
- ✅ MongoDB SSL with certifi CA bundle
- ✅ Secrets never committed to git
- ✅ SQLite blocked in production

---

## 🗺 Roadmap

- [ ] User authentication
- [ ] One-click subdomain deployment
- [ ] More section types (pricing, testimonials)
- [ ] Section-level regeneration
- [ ] SEO meta generation
- [ ] Custom color themes

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with ❤️ using **Next.js**, **FastAPI**, and **OpenAI**

🌐 **Live**: [siteforge-ai-ten.vercel.app](https://siteforge-ai-ten.vercel.app) &nbsp;•&nbsp; ⭐ Star this repo if you found it useful!

</div>