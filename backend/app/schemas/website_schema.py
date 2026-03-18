from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class SEO(BaseModel):
    title: str
    description: str
    keywords: list[str] = []
    og_title: Optional[str] = None
    og_description: Optional[str] = None

    model_config = {"str_strip_whitespace": True}


class Navbar(BaseModel):
    logo: str
    links: list[str]

    model_config = {"str_strip_whitespace": True}


class Hero(BaseModel):
    title: str
    subtitle: str
    cta: str

    model_config = {"str_strip_whitespace": True}


class Feature(BaseModel):
    title: str
    description: str
    icon: Optional[str] = "✦"

    model_config = {"str_strip_whitespace": True}


class GalleryImage(BaseModel):
    url: str
    alt: str
    caption: Optional[str] = ""

    model_config = {"str_strip_whitespace": True}


class ContactField(BaseModel):
    label: str
    type: str
    placeholder: str

    model_config = {"str_strip_whitespace": True}


class ContactForm(BaseModel):
    title: str
    subtitle: Optional[str] = ""
    fields: list[ContactField]
    submit_label: str = "Send Message"

    model_config = {"str_strip_whitespace": True}


class Footer(BaseModel):
    text: str
    social: Optional[list[str]] = []

    model_config = {"str_strip_whitespace": True}


class Website(BaseModel):
    seo: Optional[SEO] = None
    navbar: Navbar
    hero: Hero
    features: list[Feature]
    gallery: Optional[list[GalleryImage]] = []
    contact: Optional[ContactForm] = None
    footer: Footer