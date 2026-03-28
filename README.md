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
  <a href="https://siteforge-ai-ten.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-siteforge--ai--ten.vercel.app-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-reference">API</a>
</p>

---

![SiteForge AI Preview](frontend/public/preview.png)

</div>

---

## 🎯 What is SiteForge AI?

**SiteForge AI** is a full-stack AI-powered website generator. Describe any website in plain English and get a complete, structured, responsive website — with navbar, hero, features, image gallery, contact form, and footer — generated in seconds using Meta-Llama-3 via Hugging Face.

> *"A modern SaaS landing page for a project management tool"* → Full website, instantly.

🔗 **Live App:** [SiteForge AI](https://siteforge-ai-sigma.vercel.app)

---

## ✨ Features

- 🤖 **AI Generation** — Powered by Meta-Llama-3-8B-Instruct via Hugging Face
- ✏️ **Inline Editing** — Click any text in the preview to edit it directly
- 🔄 **Section Regeneration** — Regenerate individual sections independently
- 📦 **Export to ZIP** — Download complete HTML/CSS/JS files ready to deploy
- 🗂 **Project History** — All generated websites saved to MongoDB
- 🖼 **Image Gallery** — AI-generated gallery with lightbox viewer
- 📬 **Contact Form** — Fully functional contact form section
- ⚡ **~5-10s Generation** — Fast, real-time feedback with loading phases
- 📱 **Fully Responsive** — Works on desktop, tablet, and mobile
- 🔒 **Production Ready** — Rate limiting, input validation, structured logging

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
| Hugging Face Inference API | AI generation (Meta-Llama-3-8B-Instruct) |
| Pydantic v2 | Data validation |
| Motor (async) | MongoDB driver |
| Tenacity | Retry logic |
| structlog | Structured logging |
| slowapi | Rate limiting |

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

### 1. Clone the repository

```bash
git clone https://github.com/sheihan-javaid/siteforge-ai.git
cd siteforge-ai
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:
```env
ENVIRONMENT=development
HUGGINGFACE_API_KEY=hf_your_key_here
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/siteforge
MONGODB_DB_NAME=siteforge
```

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## 📁 Project Structure

```
siteforge-ai/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── page.tsx
│       │   ├── layout.tsx
│       │   └── globals.css
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Navbar.tsx
│       │   │   └── Footer.tsx
│       │   ├── sections/
│       │   │   ├── Hero.tsx
│       │   │   ├── Features.tsx
│       │   │   ├── Gallery.tsx
│       │   │   └── ContactFormSection.tsx
│       │   ├── ui/
│       │   │   ├── Button.tsx
│       │   │   └── EditableText.tsx
│       │   └── WebsitePreview.tsx
│       ├── hooks/
│       │   ├── useGenerate.ts
│       │   └── useEditableWebsite.ts
│       ├── lib/
│       │   ├── api.ts
│       │   └── utils.ts
│       └── types/
│           └── website.ts
│
└── backend/
    └── app/
        ├── main.py
        ├── core/
        │   ├── config.py
        │   ├── database.py
        │   └── logger.py
        ├── routes/
        │   ├── generate.py
        │   ├── export.py
        │   ├── projects.py
        │   └── health.py
        ├── services/
        │   └── llm_service.py
        └── schemas/
            └── website_schema.py
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
    "navbar": { "logo": "ProjectFlow", "links": ["Home", "Features"] },
    "hero": { "title": "...", "subtitle": "...", "cta": "..." },
    "features": [{ "title": "...", "description": "...", "icon": "🚀" }],
    "gallery": [{ "url": "...", "alt": "...", "caption": "..." }],
    "contact": { "title": "...", "fields": [...], "submit_label": "..." },
    "footer": { "text": "...", "social": ["twitter", "github"] }
  }
}
```

### Export Website

```http
POST /v1/export/export
```

Returns a downloadable ZIP with `index.html`, `styles.css`, `script.js`.

### Projects CRUD

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
| `504` | Request timed out |

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ENVIRONMENT` | No | `development` or `production` |
| `HUGGINGFACE_API_KEY` | **Yes** | Hugging Face access token |
| `MONGODB_URL` | **Yes** | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | No | Database name (default: `siteforge`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:8000`) |

---

## 🚢 Deployment

**Backend → [Render](https://render.com):**
```bash
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

**Frontend → [Vercel](https://vercel.com):**
- Set Root Directory to `frontend`
- Add `NEXT_PUBLIC_API_URL` pointing to your Render URL

---

## 🛡 Security

- ✅ Rate limiting (10 req/min per IP)
- ✅ Input validation (min 10, max 2000 characters)
- ✅ CORS restricted to known origins in production
- ✅ MongoDB SSL with certifi CA bundle
- ✅ Secrets never committed to git

---

## 📄 License

MIT License

---

<div align="center">

Built with ❤️ using **Next.js**, **FastAPI**, and **Hugging Face**

🔗 **[siteforge-ai-ten.vercel.app](https://siteforge-ai-ten.vercel.app)**

⭐ Star this repo if you found it useful!

</div>