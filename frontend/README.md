<div align="center">

<img src="https://img.shields.io/badge/SiteForge_AI-v0.1.0-0ea5e9?style=for-the-badge&logo=sparkles&logoColor=white" alt="SiteForge AI" />

# ⚡ SiteForge AI

### Generate stunning websites instantly — just describe your idea.

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi" />
  <img src="https://img.shields.io/badge/HuggingFace-Meta--Llama--3-FFD21E?style=flat-square&logo=huggingface" />
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
  <a href="#-documentation">Documentation</a>
</p>

---

![SiteForge AI Preview](frontend/public/preview.png)
</div>

---

## 🎯 What is SiteForge AI?

**SiteForge AI** is a full-stack AI-powered website generator. Describe any website in plain English and get a complete, structured, responsive website — with navbar, hero, features, image gallery, contact form, footer, and SEO metadata — generated in seconds using Meta-Llama-3-8B-Instruct via Hugging Face.

> *"A modern SaaS landing page for a project management tool"* → Full website, instantly.

---

## ✨ Features

- 🤖 **AI Generation** — Powered by Meta-Llama-3-8B-Instruct via Hugging Face Inference API
- ✏️ **Inline Editing** — Click any text in the preview to edit it directly
- 🔄 **Section Regeneration** — Hover any section and regenerate it independently
- 🔍 **SEO Generation** — Auto-generates title, description, keywords, and OG tags
- 📦 **Export to ZIP** — Download complete HTML/CSS/JS files ready to deploy
- 🗂 **Project History** — All generated websites saved to MongoDB, browsable in a drawer
- 🖼 **Image Gallery** — AI-generated gallery with lightbox viewer
- 📬 **Contact Form** — Fully functional contact form section
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
| Hugging Face Inference API | AI generation |
| Meta-Llama-3-8B-Instruct | LLM model |
| Pydantic v2 | Data validation |
| Motor (async) | MongoDB driver |
| Tenacity | Retry logic |
| structlog | Structured logging |
| slowapi | Rate limiting |
| Uvicorn | ASGI server |

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
- **Hugging Face API Key** — [Get one here](https://huggingface.co/settings/tokens)
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

# Configure environment
cp .env.example .env
```

Edit `backend/.env`:

```env
ENVIRONMENT=development
HUGGINGFACE_API_KEY=hf_your_key_here
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

# Configure environment
cp .env.example .env.local
```

Edit `frontend/.env.local`:

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
│       │   │   ├── EditableText.tsx   # Click-to-edit text component
│       │   │   └── RegenerateButton.tsx    # Section regenerate button
│       │   ├── WebsitePreview.tsx     # Preview orchestrator
│       │   ├── ProjectHistory.tsx     # Saved projects drawer
│       │   └── SEOHead.tsx            # SEO meta tag injector
│       ├── hooks/
│       │   ├── useGenerate.ts         # Generation state hook
│       │   ├── useEditableWebsite.ts  # Inline editing state hook
│       │   └── useRegenerate.ts       # Section regeneration hook
│       ├── lib/
│       │   ├── api.ts                 # Axios client + all API calls
│       │   └── utils.ts               # cn() utility
│       └── types/
│           └── website.ts             # TypeScript interfaces
│
├── backend/                           # FastAPI App
│   └── app/
│       ├── main.py                    # App factory + middleware
│       ├── core/
│       │   ├── config.py              # Pydantic settings
│       │   ├── database.py            # MongoDB connection
│       │   └── logger.py              # Structured logging
│       ├── routes/
│       │   ├── generate.py            # POST /v1/generate/generate
│       │   │                          # POST /v1/generate/regenerate
│       │   ├── export.py              # POST /v1/export/export
│       │   ├── projects.py            # CRUD /v1/projects/
│       │   └── health.py              # GET  /v1/health
│       ├── services/
│       │   ├── llm_service.py         # Hugging Face integration
│       │   └── template_service.py    # Fallback enhancer
│       ├── schemas/
│       │   └── website_schema.py      # Pydantic website models
│       └── utils/
│           ├── parser.py              # LLM JSON parser
│           └── validator.py           # Website validator
│
└── docs/
    ├── ARCHITECTURE.md                # System architecture diagram
    └── MODEL_SELECTION.md             # AI model rationale
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
    "seo": { "title": "...", "description": "...", "keywords": [...] },
    "navbar": { "logo": "ProjectFlow", "links": ["Home", "Features"] },
    "hero": { "title": "...", "subtitle": "...", "cta": "..." },
    "features": [{ "title": "...", "description": "...", "icon": "🚀" }],
    "gallery": [{ "url": "...", "alt": "...", "caption": "..." }],
    "contact": { "title": "...", "fields": [...], "submit_label": "..." },
    "footer": { "text": "...", "social": ["twitter", "github"] }
  }
}
```

### Regenerate Section

```http
POST /v1/generate/regenerate
Content-Type: application/json
```

**Request**
```json
{
  "prompt": "A SaaS landing page",
  "section": "hero",
  "current_website": { ... }
}
```

### Export Website

```http
POST /v1/export/export
```

Returns a downloadable ZIP containing `index.html`, `styles.css`, `script.js`.

### Projects

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/v1/projects/` | List all saved projects |
| `POST` | `/v1/projects/` | Save a project |
| `GET` | `/v1/projects/{id}` | Get a project |
| `DELETE` | `/v1/projects/{id}` | Delete a project |

### Error Responses

| Status | Meaning |
|---|---|
| `422` | Invalid prompt |
| `429` | Rate limit exceeded (10 req/min) |
| `502` | AI service error |
| `503` | Model loading — wait 20s and retry |
| `504` | Request timed out |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ENVIRONMENT` | No | `development` or `production` |
| `HUGGINGFACE_API_KEY` | **Yes** | Your Hugging Face access token |
| `MONGODB_URL` | **Yes** | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | No | Database name (default: `siteforge`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:8000`) |

---

## 🚢 Deployment

### Backend → Render

```bash
# Start command
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

Set environment variables in Render dashboard:
```env
ENVIRONMENT=production
HUGGINGFACE_API_KEY=hf_...
MONGODB_URL=mongodb+srv://...
MONGODB_DB_NAME=siteforge
```

### Frontend → Vercel

```bash
npm install -g vercel
vercel --prod
```

Set environment variable in Vercel dashboard:
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 🛡 Security

- ✅ Rate limiting (10 req/min per IP on generate, 20/min on regenerate)
- ✅ Input validation (min 10, max 2000 characters)
- ✅ CORS restricted to known origins in production
- ✅ API docs disabled in production
- ✅ MongoDB SSL with certifi CA bundle
- ✅ Secrets never committed to git

---

## 📚 Documentation

- [System Architecture](docs/ARCHITECTURE.md) — component diagram and data flow
- [Model Selection](docs/MODEL_SELECTION.md) — AI model and database rationale

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

Built with ❤️ using **Next.js**, **FastAPI**, and **Hugging Face**

⭐ Star this repo if you found it useful!

</div>