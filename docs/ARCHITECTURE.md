# SiteForge AI — System Architecture

## Overview

SiteForge AI is a full-stack application that transforms natural language descriptions into complete, responsive websites using AI. The system consists of a Next.js frontend, FastAPI backend, Hugging Face AI integration, and MongoDB database.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Next.js 16 Frontend                    │    │
│  │                                                           │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │    │
│  │  │ page.tsx │  │ Navbar   │  │  Hero    │  │Gallery │  │    │
│  │  │(Generator│  │Component │  │Component │  │Section │  │    │
│  │  │& Preview)│  └──────────┘  └──────────┘  └────────┘  │    │
│  │  └──────────┘                                            │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │    │
│  │  │ Features │  │ Contact  │  │  Footer  │  │  SEO   │  │    │
│  │  │ Section  │  │  Form    │  │Component │  │  Head  │  │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘  │    │
│  │                                                           │    │
│  │  ┌─────────────────┐  ┌──────────────────────────────┐  │    │
│  │  │ useGenerate Hook│  │    useEditableWebsite Hook    │  │    │
│  │  └─────────────────┘  └──────────────────────────────┘  │    │
│  │                                                           │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              Axios API Client (lib/api.ts)        │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────────┘
                          │ HTTP/REST
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        Middleware                         │   │
│  │  ┌────────────┐  ┌──────────────┐  ┌─────────────────┐  │   │
│  │  │    CORS    │  │ Rate Limiter │  │  Structured Log  │  │   │
│  │  │ Middleware │  │  (slowapi)   │  │   (structlog)    │  │   │
│  │  └────────────┘  └──────────────┘  └─────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  /v1/    │  │  /v1/    │  │  /v1/    │  │    /v1/      │   │
│  │ generate │  │  export  │  │ projects │  │    health    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                      Services Layer                       │   │
│  │  ┌─────────────────┐  ┌────────────────────────────────┐ │   │
│  │  │   LLM Service   │  │       Template Service         │ │   │
│  │  │ (llm_service.py)│  │   (template_service.py)        │ │   │
│  │  └─────────────────┘  └────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        Utils Layer                        │   │
│  │  ┌──────────────┐  ┌──────────────┐                      │   │
│  │  │  parser.py   │  │ validator.py │                      │   │
│  │  │ (JSON parse) │  │  (Pydantic)  │                      │   │
│  │  └──────────────┘  └──────────────┘                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────┬────────────────────────────┬─────────────────────┘
               │                            │
               ▼                            ▼
┌──────────────────────┐      ┌─────────────────────────┐
│   Hugging Face API   │      │       MongoDB Atlas      │
│                      │      │                         │
│  Meta-Llama-3-8B     │      │  ┌───────────────────┐  │
│  -Instruct           │      │  │projects collection │  │
│                      │      │  │ ┌───────────────┐  │  │
│  Input: prompt +     │      │  │ │  _id          │  │  │
│  system instructions │      │  │ │  prompt       │  │  │
│                      │      │  │ │  website {}   │  │  │
│  Output: structured  │      │  │ │  created_at   │  │  │
│  JSON website        │      │  │ │  updated_at   │  │  │
│                      │      │  │ └───────────────┘  │  │
└──────────────────────┘      │  └───────────────────┘  │
                              └─────────────────────────┘
```

---

## Component Overview

### Frontend (`/frontend`)

| Component | Location | Purpose |
|---|---|---|
| `page.tsx` | `src/app/` | Main UI — generator form and preview orchestrator |
| `layout.tsx` | `src/app/` | Root layout — fonts, metadata, global styles |
| `Navbar.tsx` | `src/components/layout/` | Generated navbar renderer with inline editing |
| `Footer.tsx` | `src/components/layout/` | Generated footer renderer with inline editing |
| `Hero.tsx` | `src/components/sections/` | Generated hero section with inline editing |
| `Features.tsx` | `src/components/sections/` | Generated features grid with inline editing |
| `Gallery.tsx` | `src/components/sections/` | Image gallery with lightbox |
| `ContactFormSection.tsx` | `src/components/sections/` | Interactive contact form |
| `SEOHead.tsx` | `src/components/` | Injects SEO meta tags into document head |
| `WebsitePreview.tsx` | `src/components/` | Composes all sections, manages editable state |
| `ProjectHistory.tsx` | `src/components/` | Saved projects drawer |
| `EditableText.tsx` | `src/components/ui/` | Click-to-edit text component |
| `Button.tsx` | `src/components/ui/` | Reusable button with variants |
| `useGenerate.ts` | `src/hooks/` | Generation state management |
| `useEditableWebsite.ts` | `src/hooks/` | Inline editing state management |
| `api.ts` | `src/lib/` | Axios client and all API calls |
| `website.ts` | `src/types/` | TypeScript interfaces for website data |

### Backend (`/backend`)

| Module | Location | Purpose |
|---|---|---|
| `main.py` | `app/` | FastAPI app factory, middleware, routing |
| `config.py` | `app/core/` | Pydantic settings from environment variables |
| `database.py` | `app/core/` | MongoDB connection and index management |
| `logger.py` | `app/core/` | Structured logging setup with structlog |
| `generate.py` | `app/routes/` | `POST /v1/generate/generate` — main generation endpoint |
| `export.py` | `app/routes/` | `POST /v1/export/export` — HTML/CSS/JS zip export |
| `projects.py` | `app/routes/` | CRUD for saved projects |
| `health.py` | `app/routes/` | `GET /v1/health` — health check |
| `llm_service.py` | `app/services/` | Hugging Face API integration with retry logic |
| `template_service.py` | `app/services/` | Fallback values for missing AI sections |
| `website_schema.py` | `app/schemas/` | Pydantic models for website structure |
| `parser.py` | `app/utils/` | LLM JSON extraction and parsing |
| `validator.py` | `app/utils/` | Website data validation |

---

## Data Flow

### Generation Flow

```
User types prompt
       │
       ▼
Frontend validates (min 10, max 2000 chars)
       │
       ▼
POST /v1/generate/generate
       │
       ▼
Rate limiter checks (10 req/min per IP)
       │
       ▼
LLM Service → Hugging Face API
  - System prompt with JSON schema
  - User prompt
  - max_tokens: 2000
  - temperature: 0.7
       │
       ▼
Response JSON extracted and cleaned
       │
       ▼
parse_llm_json() → validates JSON syntax
       │
       ▼
enhance_template() → fills missing sections with defaults
       │
       ▼
validate_website() → Pydantic schema validation
       │
       ▼
Auto-save to MongoDB
       │
       ▼
Return GenerateResponse to frontend
       │
       ▼
WebsitePreview renders all sections
       │
       ▼
SEOHead injects meta tags into document
```

### Export Flow

```
User clicks Download
       │
       ▼
WebsitePreview passes current editable state
       │
       ▼
POST /v1/export/export
       │
       ▼
generate_html() — builds index.html with SEO tags,
                  navbar, hero, features, gallery,
                  contact form, footer
       │
       ▼
generate_css()  — complete stylesheet
       │
       ▼
generate_js()   — smooth scroll, animations,
                  gallery lightbox, contact form handler
       │
       ▼
ZipFile in memory (index.html + styles.css + script.js + README.txt)
       │
       ▼
StreamingResponse → browser downloads zip
```

### Project History Flow

```
Every generation → auto-save to MongoDB projects collection
       │
       ▼
User opens History drawer
       │
       ▼
GET /v1/projects/ → returns last 50 projects sorted by date
       │
       ▼
User clicks a project → loadWebsite() sets state directly
       │
       ▼
Preview renders saved website instantly (no regeneration)
       │
       ▼
User can edit, download, or delete
```

---

## Database Schema

### `projects` Collection

```json
{
  "_id": "ObjectId",
  "prompt": "A SaaS landing page for a project management tool",
  "website": {
    "seo": {
      "title": "ProjectFlow | Manage Teams Effortlessly",
      "description": "The all-in-one platform for modern teams.",
      "keywords": ["project management", "saas", "teams"],
      "og_title": "ProjectFlow",
      "og_description": "Manage teams effortlessly."
    },
    "navbar": { "logo": "ProjectFlow", "links": ["Home", "Features", "Pricing"] },
    "hero": { "title": "...", "subtitle": "...", "cta": "..." },
    "features": [{ "title": "...", "description": "...", "icon": "🚀" }],
    "gallery": [{ "url": "...", "alt": "...", "caption": "..." }],
    "contact": { "title": "...", "fields": [...], "submit_label": "..." },
    "footer": { "text": "...", "social": ["twitter", "github"] }
  },
  "created_at": "2026-03-18T10:00:00Z",
  "updated_at": "2026-03-18T10:00:00Z"
}
```

### Indexes

| Index | Field | Purpose |
|---|---|---|
| `idx_created_at` | `created_at` | Sort projects by date |
| `idx_prompt` | `prompt` | Search projects by prompt |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/v1/generate/generate` | Generate website from prompt |
| `POST` | `/v1/export/export` | Export website as HTML/CSS/JS zip |
| `GET` | `/v1/projects/` | List all saved projects |
| `POST` | `/v1/projects/` | Save a project |
| `GET` | `/v1/projects/{id}` | Get a single project |
| `DELETE` | `/v1/projects/{id}` | Delete a project |
| `GET` | `/v1/health` | Health check |

---

## Security

| Measure | Implementation |
|---|---|
| Rate limiting | 10 requests/minute per IP via slowapi |
| Input validation | Min 10, max 2000 characters on all prompts |
| CORS | Restricted to known origins in production |
| API docs | Disabled in production |
| MongoDB SSL | TLS with certifi CA bundle |
| Environment secrets | All keys in `.env`, never committed |

---

## Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | Next.js | 16 |
| Frontend Language | TypeScript | 5 |
| Styling | Tailwind CSS | 3 |
| HTTP Client | Axios | latest |
| Backend Framework | FastAPI | 0.110 |
| Backend Language | Python | 3.11+ |
| AI Provider | Hugging Face Inference API | latest |
| AI Model | Meta-Llama-3-8B-Instruct | latest |
| Database | MongoDB Atlas | 7 |
| DB Driver | Motor (async) | latest |
| Data Validation | Pydantic | v2 |
| Logging | structlog | latest |
| Rate Limiting | slowapi | latest |