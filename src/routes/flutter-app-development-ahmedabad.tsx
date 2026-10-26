import { createFileRoute } from "@tanstack/react-router";
import { LocalLanding, localHead } from "@/components/local-landing";

const P = "/flutter-app-development-ahmedabad";
export const Route = createFileRoute("/flutter-app-development-ahmedabad")({
  head: () =>
    localHead(
      P,
      "Flutter App Development in Ahmedabad | Novyra Digital",
      "Flutter app development in Ahmedabad: Android and iOS apps from one codebase, with backend, admin panel and store submission.",
    ),
  component: () => (
    <LocalLanding
      c={{
        eyebrow: "Flutter apps · Ahmedabad",
        h1: "Flutter App Development in Ahmedabad",
        intro:
          "Launch on Android and iOS together. We build Flutter apps for Ahmedabad startups and businesses — booking, ordering, loyalty, field-team and customer-portal apps — with the backend and admin tools to run them.",
        serviceSlug: "mobile-app-development",
        why: [
          {
            t: "One codebase",
            d: "Lower build and maintenance effort than two separate native apps.",
          },
          {
            t: "Backend included",
            d: "APIs, databases and admin dashboards designed together with the app.",
          },
          {
            t: "Store guidance",
            d: "Help with Play Store and App Store listings, policies and review.",
          },
        ],
        localNotes: [
          {
            t: "Android-heavy audience",
            d: "Most users in Gujarat are on Android, often mid-range devices. We test on realistic hardware, not just flagships.",
          },
          {
            t: "UPI and local payments",
            d: "Apps can integrate Indian payment gateways that support UPI, cards and wallets.",
          },
          {
            t: "Start with an MVP",
            d: "For startups, we scope a first version that can reach users quickly and be improved from real feedback.",
          },
        ],
        includes: [
          "Product discovery and user flows",
          "App UI design",
          "Flutter development for Android and iOS",
          "API or Firebase backend",
          "Admin dashboard",
          "Store submission support",
        ],
        faqs: [
          {
            q: "Is Flutter cheaper than native apps?",
            a: "Usually, because one codebase serves both platforms. Exact cost depends on features and backend scope.",
          },
          {
            q: "Do I need a backend?",
            a: "Most business apps need accounts, data storage or notifications, which require a backend. We'll explain the options.",
          },
          {
            q: "Whose name are the store accounts in?",
            a: "Your business's. You should own your developer accounts and app listings.",
          },
        ],
      }}
    />
  ),
});
