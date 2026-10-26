import { Link, useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo, btn } from "./brand";
import { ThemeToggle } from "./theme-toggle";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/work", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/about", label: "About" },
  { to: "/insights", label: "Insights" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ announcement }: { announcement?: string | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [svcOpen, setSvcOpen] = useState(false);
  const location = useLocation();
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    setOpen(false);
    setSvcOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const linkCls =
    "relative rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
  const activeCls =
    "!text-foreground after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary";

  return (
    <>
      {announcement && (
        <div className="bg-gradient-brand text-primary-foreground">
          <p className="container-page py-2 text-center text-xs font-medium sm:text-sm">
            {announcement}{" "}
            <Link to="/contact" className="underline underline-offset-2">
              Start a project
            </Link>
          </p>
        </div>
      )}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="container-page flex h-[72px] items-center justify-between gap-4">
          <Link to="/" aria-label="Novyra Digital home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => {
                window.clearTimeout(closeTimer.current);
                setSvcOpen(true);
              }}
              onMouseLeave={() => {
                closeTimer.current = window.setTimeout(() => setSvcOpen(false), 120);
              }}
              onKeyDown={(e) => e.key === "Escape" && setSvcOpen(false)}
            >
              <button
                type="button"
                aria-expanded={svcOpen}
                aria-controls="services-menu"
                onClick={() => setSvcOpen((v) => !v)}
                className={cn(
                  linkCls,
                  "inline-flex items-center gap-1",
                  location.pathname.startsWith("/services") && activeCls,
                )}
              >
                Services{" "}
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", svcOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {svcOpen && (
                  <motion.div
                    id="services-menu"
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3"
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-popover p-3 shadow-lift">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          to="/services/$slug"
                          params={{ slug: s.slug }}
                          className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent focus-visible:bg-accent"
                        >
                          <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-foreground" />
                          <span>
                            <span className="block text-sm font-semibold text-foreground">
                              {s.name}
                            </span>
                            <span className="mt-0.5 line-clamp-1 block text-xs text-muted-foreground">
                              {s.short}
                            </span>
                          </span>
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        className="col-span-2 mt-1 flex items-center justify-center gap-1 rounded-xl bg-accent p-2.5 text-sm font-semibold text-accent-foreground"
                      >
                        All services <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className={linkCls} activeProps={{ className: activeCls }}>
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/contact" className={cn(btn({ size: "sm" }), "hidden sm:inline-flex")}>
              Start a Project
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              aria-label="Mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100dvh - 72px)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-y-auto border-t border-border bg-background lg:hidden"
            >
              <div className="container-page flex flex-col gap-1 py-6">
                <p className="eyebrow mb-2">Services</p>
                {SERVICES.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-[15px] font-medium hover:bg-accent"
                  >
                    <s.icon className="h-4 w-4 text-accent-foreground" /> {s.name}
                  </Link>
                ))}
                <div className="my-4 h-px bg-border" />
                {NAV.map((n) => (
                  <Link
                    key={n.to}
                    to={n.to}
                    className="rounded-xl px-2 py-3 font-display text-xl font-bold hover:bg-accent"
                  >
                    {n.label}
                  </Link>
                ))}
                <div className="mt-6 flex items-center gap-3">
                  <Link to="/contact" className={cn(btn({ size: "lg" }), "flex-1")}>
                    Start a Project
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
