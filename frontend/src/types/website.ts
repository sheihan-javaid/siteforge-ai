export interface SEO {
  title: string;
  description: string;
  keywords: string[];
  og_title?: string;
  og_description?: string;
}

export interface Navbar {
  logo: string;
  links: string[];
}

export interface Hero {
  title: string;
  subtitle: string;
  cta: string;
}

export interface Feature {
  id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface GalleryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface ContactField {
  label: string;
  type: "text" | "email" | "textarea";
  placeholder: string;
}

export interface ContactForm {
  title: string;
  subtitle?: string;
  fields: ContactField[];
  submit_label: string;
}

export interface Footer {
  text: string;
  social?: string[];
}

export interface Website {
  seo?: SEO;
  navbar: Navbar;
  hero: Hero;
  features: Feature[];
  gallery?: GalleryImage[];
  contact?: ContactForm;
  footer: Footer;
}

export interface GenerateResponse {
  status: "success" | "error";
  data: Website;
  error?: string;
}

export interface PromptRequest {
  prompt: string;
}

export type GenerateState = {
  loading: boolean;
  data?: Website;
  error?: string;
};