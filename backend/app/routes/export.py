from __future__ import annotations

import io
import zipfile
import logging
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Annotated, Optional

logger = logging.getLogger(__name__)
router = APIRouter()


class ExportRequest(BaseModel):
    seo: Optional[dict] = None
    navbar: dict
    hero: dict
    features: list
    gallery: Optional[list] = []
    contact: Optional[dict] = None
    footer: dict
    site_name: Annotated[str, Field(default="my-website", min_length=1, max_length=50)]


def generate_html(data: ExportRequest) -> str:
    # SEO tags
    seo = data.seo or {}
    seo_title = seo.get("title") or data.hero.get("title") or data.site_name
    seo_description = seo.get("description") or data.hero.get("subtitle", "")
    seo_keywords = ", ".join(seo.get("keywords", []))
    og_title = seo.get("og_title") or seo_title
    og_description = seo.get("og_description") or seo_description

    # Navbar links
    nav_links = "\n".join(
        f'            <a href="#" class="nav-link">{link}</a>'
        for link in data.navbar.get("links", [])
    )

    # Features
    features_html = "\n".join(
        f"""
        <div class="feature-card">
            <div class="feature-icon">{f.get("icon", "✦")}</div>
            <h3 class="feature-title">{f.get("title", "")}</h3>
            <p class="feature-desc">{f.get("description", "")}</p>
        </div>"""
        for f in data.features
    )

    # Gallery
    gallery_html = ""
    if data.gallery:
        gallery_items = "\n".join(
            f"""
        <div class="gallery-item">
            <img src="{img.get("url", "")}" alt="{img.get("alt", "")}" loading="lazy" />
            {f'<p class="gallery-caption">{img.get("caption")}</p>' if img.get("caption") else ""}
        </div>"""
            for img in data.gallery
        )
        gallery_html = f"""
  <!-- GALLERY -->
  <section class="gallery">
    <div class="container">
      <h2 class="section-title">Gallery</h2>
      <div class="gallery-grid">
{gallery_items}
      </div>
    </div>
  </section>"""

    # Contact form
    contact_html = ""
    if data.contact:
        contact = data.contact
        fields_html = ""
        for field in contact.get("fields", []):
            label = field.get("label", "")
            placeholder = field.get("placeholder", "")
            field_type = field.get("type", "text")
            if field_type == "textarea":
                fields_html += f"""
          <div class="form-group">
            <label>{label}</label>
            <textarea placeholder="{placeholder}" rows="4" required></textarea>
          </div>"""
            else:
                fields_html += f"""
          <div class="form-group">
            <label>{label}</label>
            <input type="{field_type}" placeholder="{placeholder}" required />
          </div>"""

        contact_html = f"""
  <!-- CONTACT -->
  <section class="contact">
    <div class="container">
      <div class="contact-inner">
        <h2 class="section-title">{contact.get("title", "Get In Touch")}</h2>
        {f'<p class="section-subtitle">{contact.get("subtitle")}</p>' if contact.get("subtitle") else ""}
        <form class="contact-form" onsubmit="handleContactSubmit(event)">
{fields_html}
          <button type="submit" class="btn-primary">{contact.get("submit_label", "Send Message")}</button>
        </form>
        <div id="form-success" class="form-success" style="display:none">
          ✅ Message sent! We'll get back to you soon.
        </div>
      </div>
    </div>
  </section>"""

    # Footer social links
    social_links = ""
    for s in data.footer.get("social", []):
        social_links += f'<a href="#" class="social-link">{s.capitalize()}</a>\n'

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{seo_title}</title>
  <meta name="description" content="{seo_description}" />
  <meta name="keywords" content="{seo_keywords}" />
  <meta property="og:title" content="{og_title}" />
  <meta property="og:description" content="{og_description}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- NAVBAR -->
  <header class="navbar">
    <div class="container nav-inner">
      <span class="nav-logo">{data.navbar.get("logo", "Logo")}</span>
      <nav class="nav-links">
{nav_links}
      </nav>
      <button class="nav-cta">{data.hero.get("cta", "Get Started")}</button>
    </div>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-badge">✦ AI Generated</div>
      <h1 class="hero-title">{data.hero.get("title", "")}</h1>
      <p class="hero-subtitle">{data.hero.get("subtitle", "")}</p>
      <a href="#contact" class="btn-primary">{data.hero.get("cta", "Get Started")}</a>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="features">
    <div class="container">
      <h2 class="section-title">Features</h2>
      <div class="features-grid">
{features_html}
      </div>
    </div>
  </section>

{gallery_html}

{contact_html}

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container footer-inner">
      <p class="footer-text">{data.footer.get("text", "")}</p>
      <div class="social-links">
        {social_links}
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>"""


def generate_css() -> str:
    return """/* ================================
   SiteForge AI — Generated Styles
================================ */

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --brand:     #0ea5e9;
  --brand-dk:  #0284c7;
  --bg:        #030712;
  --bg-card:   rgba(255,255,255,0.03);
  --border:    rgba(255,255,255,0.08);
  --text:      #f1f5f9;
  --muted:     rgba(255,255,255,0.45);
  --radius:    0.75rem;
  --font-display: 'Syne', sans-serif;
  --font-body:    'DM Sans', sans-serif;
}

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ---- NAVBAR ---- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(3,7,18,0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.nav-logo {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, #7dd3fc 50%, #38bdf8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links { display: flex; align-items: center; gap: 2rem; }
.nav-link { color: var(--muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s ease; }
.nav-link:hover { color: var(--text); }

.nav-cta {
  background: linear-gradient(135deg, var(--brand), #06b6d4);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(14,165,233,0.35); }

/* ---- HERO ---- */
.hero { padding: 8rem 0 6rem; position: relative; overflow: hidden; }
.hero::before {
  content: '';
  position: absolute;
  top: -200px; left: 50%;
  transform: translateX(-50%);
  width: 900px; height: 500px;
  background: radial-gradient(ellipse, rgba(14,165,233,0.15) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}

.hero-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.5rem; position: relative; }

.hero-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.35rem 1rem; border-radius: 999px;
  background: rgba(14,165,233,0.08); border: 1px solid rgba(14,165,233,0.2);
  color: #38bdf8; font-size: 0.75rem; font-weight: 500;
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800; line-height: 1.05; letter-spacing: -0.03em;
  background: linear-gradient(135deg, #ffffff 0%, #7dd3fc 50%, #38bdf8 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  max-width: 800px;
}

.hero-subtitle { font-size: 1.125rem; color: var(--muted); max-width: 560px; font-weight: 300; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: linear-gradient(135deg, var(--brand), #06b6d4);
  color: white; text-decoration: none;
  padding: 0.85rem 2rem; border-radius: var(--radius);
  font-family: var(--font-display); font-weight: 600; font-size: 0.95rem;
  transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(14,165,233,0.25);
  border: none; cursor: pointer;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(14,165,233,0.4); }

/* ---- SHARED SECTION ---- */
.section-title {
  font-family: var(--font-display);
  font-size: 2rem; font-weight: 800;
  text-align: center; margin-bottom: 1rem; letter-spacing: -0.02em;
}
.section-subtitle { text-align: center; color: var(--muted); margin-bottom: 2.5rem; }

/* ---- FEATURES ---- */
.features {
  padding: 6rem 0;
  background: rgba(255,255,255,0.01);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-top: 3rem; }
.feature-card {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 1rem; padding: 1.75rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  transition: all 0.3s ease;
}
.feature-card:hover { border-color: rgba(14,165,233,0.3); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
.feature-icon { font-size: 1.75rem; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; background: rgba(14,165,233,0.08); border-radius: 0.75rem; }
.feature-title { font-family: var(--font-display); font-size: 1.05rem; font-weight: 700; }
.feature-desc { font-size: 0.9rem; color: var(--muted); line-height: 1.6; }

/* ---- GALLERY ---- */
.gallery { padding: 6rem 0; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-top: 3rem; }
.gallery-item { position: relative; border-radius: 0.75rem; overflow: hidden; aspect-ratio: 3/2; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 0.75rem; background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white; font-size: 0.8rem; }

/* ---- CONTACT ---- */
.contact { padding: 6rem 0; background: rgba(255,255,255,0.01); border-top: 1px solid var(--border); }
.contact-inner { max-width: 560px; margin: 0 auto; }
.contact-form { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 2.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-size: 0.875rem; font-weight: 500; color: var(--text); }
.form-group input,
.form-group textarea {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 0.5rem; padding: 0.75rem 1rem;
  color: var(--text); font-family: var(--font-body); font-size: 0.875rem;
  transition: border-color 0.2s ease; resize: none;
}
.form-group input:focus,
.form-group textarea:focus { outline: none; border-color: var(--brand); box-shadow: 0 0 0 3px rgba(14,165,233,0.1); }
.form-success { margin-top: 1rem; padding: 1rem; border-radius: 0.75rem; background: rgba(14,165,233,0.08); border: 1px solid rgba(14,165,233,0.2); color: #38bdf8; text-align: center; }

/* ---- FOOTER ---- */
.footer { padding: 2.5rem 0; border-top: 1px solid var(--border); }
.footer-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
.footer-text { font-size: 0.875rem; color: var(--muted); }
.social-links { display: flex; gap: 1rem; }
.social-link { font-size: 0.875rem; color: var(--muted); text-decoration: none; transition: color 0.2s ease; }
.social-link:hover { color: var(--brand); }

/* ---- RESPONSIVE ---- */
@media (max-width: 768px) {
  .nav-links { display: none; }
  .hero { padding: 5rem 0 4rem; }
  .features-grid, .gallery-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; text-align: center; }
}"""


def generate_js() -> str:
    return """// SiteForge AI — Generated Script

document.addEventListener('DOMContentLoaded', () => {

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 20
        ? 'rgba(3,7,18,0.95)'
        : 'rgba(3,7,18,0.85)';
    });
  }

  // Animate feature cards on scroll
  const observer = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    }),
    { threshold: 0.1 }
  );

  document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  // Gallery lightbox
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:999;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;padding:2rem;cursor:pointer;backdrop-filter:blur(8px)';
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.style.cssText = 'max-width:100%;max-height:90vh;border-radius:0.75rem;box-shadow:0 24px 80px rgba(0,0,0,0.5)';
      overlay.appendChild(bigImg);
      overlay.addEventListener('click', () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });

});

// Contact form handler
function handleContactSubmit(e) {
  e.preventDefault();
  e.target.style.display = 'none';
  const success = document.getElementById('form-success');
  if (success) success.style.display = 'block';
}"""


@router.post("/export")
async def export_website(data: ExportRequest) -> StreamingResponse:
    logger.info("exporting website", extra={"site_name": data.site_name})

    try:
        buffer = io.BytesIO()
        with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zf:
            zf.writestr("index.html", generate_html(data))
            zf.writestr("styles.css", generate_css())
            zf.writestr("script.js", generate_js())
            zf.writestr(
                "README.txt",
                "Generated by SiteForge AI\n"
                "Open index.html in your browser to preview.\n"
                "Upload all three files to any web host to deploy.\n"
            )
        buffer.seek(0)

        filename = f"{data.site_name.lower().replace(' ', '-')}.zip"
        return StreamingResponse(
            buffer,
            media_type="application/zip",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        logger.error("export failed", exc_info=True)
        raise HTTPException(status_code=500, detail="Export failed") from e