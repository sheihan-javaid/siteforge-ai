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
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss" />
</p>

<p align="center">
  <a href="#-demo">Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

![SiteForge AI Preview](https://placehold.co/1200x600/030712/0ea5e9?text=SiteForge+AI+Preview)

</div>

---

## 🎯 What is SiteForge AI?

**SiteForge AI** is a full-stack AI-powered website generator. Describe any website in plain English and get a complete, structured website — with navbar, hero section, features, and footer — generated in seconds using GPT-4o-mini.

> *"A modern SaaS landing page for a project management tool with pricing and testimonials"* → Full website, instantly.

---

## ✨ Features

- 🤖 **AI Generation** — Powered by OpenAI GPT-4o-mini with structured JSON output
- ⚡ **~5 Second Generation** — Fast, responsive, real-time feedback
- 🎨 **Beautiful UI** — Dark-themed interface with Syne + DM Sans typography
- 🔒 **Production Ready** — Rate limiting, input validation, error handling, structured logging
- 📱 **Fully Responsive** — Works on all screen sizes
- 🔄 **Retry Logic** — Automatic retries with exponential backoff via Tenacity
- 🧩 **Type Safe** — Full TypeScript frontend, Pydantic v2 backend
- 🚀 **App Router** — Built on Next.js 16 with the App Router

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
| OpenAI SDK | AI generation |
| Pydantic v2 | Data validation |
| Tenacity | Retry logic |
| structlog | Structured logging |
| slowapi | Rate limiting |
| Uvicorn | ASGI server |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **Python** 3.11+
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)

---

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/siteforge-ai.git
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
OPENAI_API_KEY=sk-proj-your-key-here
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
│
├── frontend/                          # Next.js App
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Main UI (generator + preview)
│   │   │   ├── layout.tsx             # Root layout (fonts, metadata)
│   │   │   └── globals.css            # Global styles + design tokens
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Navbar.tsx         # Generated navbar renderer
│   │   │   │   └── Footer.tsx         # Generated footer renderer
│   │   │   ├── sections/
│   │   │   │   ├── Hero.tsx           # Generated hero renderer
│   │   │   │   └── Features.tsx       # Generated features renderer
│   │   │   └── ui/
│   │   │       ├── Button.tsx         # Reusable button component
│   │   │       └── Input.tsx          # Reusable input component
│   │   ├── hooks/
│   │   │   └── useGenerate.ts         # Generation state hook
│   │   ├── lib/
│   │   │   ├── api.ts                 # Axios client + API calls
│   │   │   └── utils.ts               # cn() utility
│   │   └── types/
│   │       └── website.ts             # TypeScript interfaces
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── backend/                           # FastAPI App
    ├── app/
    │   ├── main.py                    # App factory + middleware
    │   ├── core/
    │   │   ├── config.py              # Pydantic settings
    │   │   ├── database.py            # DB init (placeholder)
    │   │   └── logger.py              # Structured logging setup
    │   ├── routes/
    │   │   ├── generate.py            # POST /v1/generate/generate
    │   │   ├── health.py              # GET  /v1/health
    │   │   └── templates.py           # GET  /v1/templates
    │   ├── services/
    │   │   └── llm_service.py         # OpenAI integration
    │   ├── schemas/
    │   │   └── website_schema.py      # Pydantic website models
    │   └── utils/
    │       ├── parser.py              # LLM JSON parser
    │       ├── validator.py           # Website validator
    │       └── template_service.py    # Fallback enhancer
    ├── .env.example
    └── requirements.txt
```

---

## 📡 API Reference

### Generate Website

```http
POST /v1/generate/generate
Content-Type: application/json
```

**Request Body**
```json
{
  "prompt": "A SaaS landing page for a project management tool"
}
```

**Response**
```json
{
  "status": "success",
  "data": {
    "navbar": {
      "logo": "https://example.com/logo.png",
      "links": ["Home", "Features", "Pricing", "Contact"]
    },
    "hero": {
      "title": "Manage Projects Effortlessly",
      "subtitle": "The all-in-one platform for modern teams.",
      "cta": "Start Free Trial"
    },
    "features": [
      { "title": "Real-time Collaboration", "description": "Work together seamlessly.", "icon": "🚀" },
      { "title": "Smart Automation", "description": "Automate repetitive tasks.", "icon": "⚡" }
    ],
    "footer": {
      "text": "© 2026 ProjectFlow. All rights reserved.",
      "social": ["twitter", "github", "linkedin"]
    }
  }
}
```

**Error Responses**

| Status | Meaning |
|--------|---------|
| `422` | Invalid prompt (too short/long) |
| `429` | Rate limit exceeded (10 req/min) |
| `502` | OpenAI API error |
| `504` | Request timed out |

---

### Health Check

```http
GET /v1/health
```

```json
{ "status": "ok" }
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `ENVIRONMENT` | No | `development` or `production` (default: `development`) |
| `OPENAI_API_KEY` | **Yes** | Your OpenAI API key |
| `REDIS_URL` | No | Redis URL for caching (production) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:8000`) |

---

## 🚢 Deployment

### Backend (Production)

Use Gunicorn with Uvicorn workers — **do not** use `uvicorn` directly in production:

```bash
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

Set production environment:
```env
ENVIRONMENT=production
OPENAI_API_KEY=sk-proj-...
REDIS_URL=redis://...
```

### Frontend (Production)

```bash
npm run build
npm start
```

Or deploy to **Vercel** (recommended):

```bash
npm install -g vercel
vercel --prod
```

---

## 🛡 Security

- ✅ Rate limiting (10 requests/minute per IP)
- ✅ Input validation (min 10, max 2000 characters)
- ✅ CORS restricted to known origins in production
- ✅ API docs disabled in production
- ✅ SQLite blocked in production
- ✅ Secrets validated at startup

---

## 🗺 Roadmap

- [ ] User authentication
- [ ] Save & manage generated websites
- [ ] Export to HTML/CSS
- [ ] More section types (pricing, testimonials, CTA)
- [ ] Custom color themes
- [ ] One-click deploy to Vercel

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **Next.js**, **FastAPI**, and **OpenAI**

⭐ Star this repo if you found it useful!

</div>
