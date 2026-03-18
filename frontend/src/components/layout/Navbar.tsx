import type { Navbar as NavbarType } from "@/types/website";
import EditableText from "@/components/ui/EditableText";

interface NavbarProps {
  data: NavbarType;
  onUpdateLogo?: (value: string) => void;
  onUpdateLink?: (index: number, value: string) => void;
}

export default function Navbar({ data, onUpdateLogo, onUpdateLink }: NavbarProps) {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-16">

        {/* Logo */}
        {onUpdateLogo ? (
          <EditableText
            value={data.logo || "SiteForge"}
            onChange={onUpdateLogo}
            as="span"
            className="text-lg font-bold text-brand-500 tracking-tight"
          />
        ) : (
          <span className="text-lg font-bold text-brand-500 tracking-tight">
            {data.logo || "SiteForge"}
          </span>
        )}

        {/* Links */}
        <ul className="flex items-center gap-6">
          {data.links?.map((link, index) => (
            <li key={index}>
              {onUpdateLink ? (
                <EditableText
                  value={link}
                  onChange={(value) => onUpdateLink(index, value)}
                  as="span"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                />
              ) : (
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              )}
            </li>
          ))}
        </ul>

      </nav>
    </header>
  );
}