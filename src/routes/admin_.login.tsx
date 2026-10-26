import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { adminSignIn, adminSignUp } from "@/lib/admin.functions";
import { Logo, btn } from "@/components/brand";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  validateSearch: z.object({ denied: z.boolean().optional() }),
  head: () => ({
    meta: [
      { title: "Admin sign in | Novyra Digital" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Login,
});

const field =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 focus:border-primary focus:outline-none";

function Login() {
  const { denied } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(
    denied ? { kind: "err", text: "This account doesn't have admin access." } : null,
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === "in") {
        await adminSignIn({ data: { email, password } });
      } else {
        await adminSignUp({ data: { email, password } });
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setMsg({ kind: "err", text: err instanceof Error ? err.message : "Something went wrong" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-dots px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-lift">
        <Logo />
        <h1 className="mt-8 font-display text-2xl font-extrabold">
          {mode === "in" ? "Admin sign in" : "Create admin account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "in"
            ? "Sign in to manage your website."
            : "The first account created becomes the site admin."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
              autoComplete="email"
            />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
              autoComplete={mode === "in" ? "current-password" : "new-password"}
            />
          </label>
          {msg && (
            <p
              role="alert"
              className={msg.kind === "err" ? "text-sm text-destructive" : "text-sm text-success"}
            >
              {msg.text}
            </p>
          )}
          <button disabled={busy} className={btn({ className: "w-full" })}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "in" ? "Sign in" : "Create account"}
          </button>
        </form>
        <button
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-5 text-sm text-accent-foreground underline"
        >
          {mode === "in"
            ? "First time? Create the admin account"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
