import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <rect width="40" height="40" rx="9" className="fill-foreground" />
      {/* Bold geometric N: two pillars joined by a thick diagonal */}
      <path d="M9 31V9h6.2L25 22.6V9h6v22h-6.2L15 17.4V31z" fill="var(--primary)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.03em] text-foreground">
          NOVYRA
        </span>
        <span className="mt-0.5 text-[0.6rem] font-semibold tracking-[0.32em] text-accent-foreground">
          DIGITAL
        </span>
      </span>
    </span>
  );
}

export const btn = cva(
  "group/btn relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-300 ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:bg-primary-hover active:translate-y-0",
        outline:
          "border border-border bg-card text-foreground hover:-translate-y-0.5 hover:border-primary/50 hover:text-accent-foreground",
        ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
        soft: "bg-accent text-accent-foreground hover:bg-primary hover:text-primary-foreground",
      },
      size: { sm: "h-9 px-4 text-sm", md: "h-11 px-6 text-sm", lg: "h-13 px-7 text-base py-3.5" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
export type BtnProps = VariantProps<typeof btn>;

export function SectionHeading({
  eyebrow,
  title,
  text,
  center,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  text?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <As className={As === "h1" ? "text-display" : "text-h2"}>{title}</As>
      {text && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text}</p>}
    </div>
  );
}
