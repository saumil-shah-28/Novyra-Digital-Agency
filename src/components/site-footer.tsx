import { Link } from "@tanstack/react-router";
import { Logo } from "./brand";
import { SERVICES } from "@/lib/services";
import { SITE } from "@/lib/site";
import type { PublicSettings } from "@/lib/data.functions";

export function SiteFooter({ settings }: { settings: PublicSettings | null }) {
  const socials = [
    ["Instagram", settings?.social_instagram],
    ["LinkedIn", settings?.social_linkedin],
    ["GitHub", settings?.social_github],
    ["X", settings?.social_x],
  ].filter(([, v]) => !!v) as [string, string][];

  return (
    <footer className="relative mt-24 border-t border-border bg-card">
      <div className="container-page grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-4 font-display text-lg font-bold">{SITE.tagline}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            An independent digital agency based in{" "}
            {settings?.service_area ?? "Ahmedabad, Gujarat, India"}.
          </p>
          <div className="mt-5 space-y-1 text-sm">
            {settings?.contact_email && (
              <a
                className="block hover:text-accent-foreground"
                href={`mailto:${settings.contact_email}`}
              >
                {settings.contact_email}
              </a>
            )}
            {settings?.contact_phone && (
              <a
                className="block hover:text-accent-foreground"
                href={`tel:${settings.contact_phone}`}
              >
                {settings.contact_phone}
              </a>
            )}
          </div>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-sm font-bold">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to="/services/$slug"
                  params={{ slug: s.slug }}
                  className="hover:text-foreground"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-sm font-bold">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/work" className="hover:text-foreground">
                Work
              </Link>
            </li>
            <li>
              <Link to="/process" className="hover:text-foreground">
                Process
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/insights" className="hover:text-foreground">
                Insights
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <h2 className="text-sm font-bold">Ahmedabad</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              <Link to="/website-development-company-ahmedabad" className="hover:text-foreground">
                Website development in Ahmedabad
              </Link>
            </li>
            <li>
              <Link to="/flutter-app-development-ahmedabad" className="hover:text-foreground">
                Flutter apps in Ahmedabad
              </Link>
            </li>
            <li>
              <Link to="/ecommerce-website-development-ahmedabad" className="hover:text-foreground">
                E-commerce in Ahmedabad
              </Link>
            </li>
          </ul>
          {socials.length > 0 && (
            <>
              <h2 className="mt-8 text-sm font-bold">Follow</h2>
              <ul className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                {socials.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Novyra Digital. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-foreground">
              Privacy policy
            </Link>
            <Link to="/terms-and-conditions" className="hover:text-foreground">
              Terms and conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
