import type { LucideIcon } from "lucide-react";
import {
  Code2,
  ShoppingBag,
  Smartphone,
  Boxes,
  Server,
  LayoutDashboard,
  Megaphone,
  SearchCheck,
  Wrench,
} from "lucide-react";

export type Service = {
  slug: string;
  name: string;
  short: string;
  icon: LucideIcon;
  title: string;
  metaDescription: string;
  intro: string;
  benefits: { title: string; text: string }[];
  scope: string[];
  deliverables: string[];
  process: string[];
  tech: string[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "website-development",
    name: "Website Design & Development",
    short: "Custom, fast, mobile-first business websites built to turn visitors into enquiries.",
    icon: Code2,
    title: "Website Design & Development in Ahmedabad",
    metaDescription:
      "Custom website design and development in Ahmedabad. Responsive, SEO-ready business websites built with modern technology by Novyra Digital.",
    intro:
      "Your website is often the first conversation a customer has with your business. We design and build custom websites that explain what you do clearly, load quickly on phones, and make it easy for people to get in touch.",
    benefits: [
      {
        title: "Designed around your customers",
        text: "Page structure follows the questions your customers actually ask before they call.",
      },
      {
        title: "Mobile-first",
        text: "Layouts are designed for phones first, where most local searches happen.",
      },
      {
        title: "Search-ready foundation",
        text: "Clean headings, metadata, structured data and a sitemap from day one.",
      },
      {
        title: "Easy to grow",
        text: "Built on reusable components so new pages don't need a rebuild.",
      },
    ],
    scope: [
      "Information architecture and sitemap",
      "Custom visual design",
      "Responsive front-end development",
      "Contact and enquiry forms",
      "Content management where needed",
      "Analytics and Search Console setup",
    ],
    deliverables: [
      "Live, responsive website",
      "Source code and access to hosting",
      "On-page SEO foundation",
      "Short handover walkthrough",
    ],
    process: [
      "Discovery call and content audit",
      "Sitemap and wireframes",
      "Visual design for key pages",
      "Development and content entry",
      "Device testing and launch",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    faqs: [
      {
        q: "How long does a business website take?",
        a: "A focused 5–8 page site typically takes a few weeks, depending mostly on how quickly content and feedback are ready. You'll get a timeline in the written scope.",
      },
      {
        q: "Will I be able to edit the content myself?",
        a: "If you need to update content regularly, we can include an admin area or CMS. For rarely-changing sites, a maintenance plan is often simpler.",
      },
      {
        q: "Do you guarantee Google rankings?",
        a: "No. Nobody can honestly guarantee rankings. We build a technically sound, well-structured site that gives your content the best chance to be found.",
      },
    ],
    related: ["ecommerce-development", "technical-seo", "website-maintenance"],
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce Website Development",
    short: "Online stores with clear product pages, smooth checkout and payment integrations.",
    icon: ShoppingBag,
    title: "E-commerce Website Development",
    metaDescription:
      "E-commerce website development for fashion, retail and D2C brands. Product catalogues, Indian payment gateways and order management.",
    intro:
      "Selling online is about trust and speed: customers need to find a product, understand it, and pay without friction. We build online stores that make that path short, and give you the tools to manage products and orders.",
    benefits: [
      {
        title: "Conversion-focused product pages",
        text: "Clear photos, sizes, variants and delivery information where shoppers look for them.",
      },
      {
        title: "Indian payment options",
        text: "UPI, cards and wallets through popular Indian payment gateways.",
      },
      {
        title: "Manageable catalogue",
        text: "Add products, stock and prices without touching code.",
      },
      {
        title: "Built for mobile shoppers",
        text: "Checkout designed for thumbs and slow connections.",
      },
    ],
    scope: [
      "Catalogue and category structure",
      "Product, cart and checkout flows",
      "Payment gateway integration",
      "Order and inventory management",
      "Shipping and tax rules",
      "Transactional emails",
    ],
    deliverables: [
      "Live online store",
      "Admin for products and orders",
      "Payment and shipping configuration",
      "Store launch checklist",
    ],
    process: [
      "Catalogue and operations review",
      "Store architecture and design",
      "Build and integrations",
      "Test orders end to end",
      "Launch and post-launch tuning",
    ],
    tech: ["Next.js", "React", "PostgreSQL", "Payment APIs"],
    faqs: [
      {
        q: "Should I use Shopify or a custom store?",
        a: "For many small catalogues a hosted platform is the right call. Custom builds make sense when you need unusual workflows, integrations or full ownership. We'll recommend honestly.",
      },
      {
        q: "Can you migrate my existing products?",
        a: "Usually yes, from a spreadsheet or another platform export. We review data quality first.",
      },
      {
        q: "Which payment gateways can you integrate?",
        a: "Common Indian gateways that offer documented APIs. The choice depends on your business registration and fees.",
      },
    ],
    related: ["website-development", "digital-marketing", "admin-panel-development"],
  },
  {
    slug: "mobile-app-development",
    name: "Flutter Mobile App Development",
    short: "Cross-platform Android and iOS apps from a single, maintainable Flutter codebase.",
    icon: Smartphone,
    title: "Flutter Mobile App Development",
    metaDescription:
      "Flutter app development for Android and iOS. One codebase, native-feeling apps with backend, notifications and store submission.",
    intro:
      "Flutter lets one codebase power both Android and iOS apps. That means fewer things to build, test and maintain — and a consistent experience for every customer. We design, build and publish Flutter apps backed by reliable APIs.",
    benefits: [
      {
        title: "One codebase, two platforms",
        text: "Ship to Android and iOS together and keep features in sync.",
      },
      {
        title: "Smooth, native-feeling UI",
        text: "Flutter renders its own widgets for consistent 60fps interfaces.",
      },
      {
        title: "Backend included",
        text: "Authentication, data, notifications and admin tools designed alongside the app.",
      },
      {
        title: "Store-ready",
        text: "Help with Play Store and App Store listings, policies and review.",
      },
    ],
    scope: [
      "Product discovery and user flows",
      "App UI/UX design",
      "Flutter development",
      "API or Firebase backend",
      "Push notifications",
      "Store submission",
    ],
    deliverables: [
      "Android and iOS builds",
      "Source code",
      "Backend and admin access",
      "Store listings",
    ],
    process: [
      "Define the first release",
      "Design key screens",
      "Build app and backend in sprints",
      "Test on real devices",
      "Publish and monitor",
    ],
    tech: ["Flutter", "Dart", "Firebase", "FastAPI", "REST APIs"],
    faqs: [
      {
        q: "Is Flutter good enough for a serious business app?",
        a: "Yes, for most business apps — booking, ordering, catalogues, portals and dashboards. Apps relying on very new platform-specific features may need extra native code.",
      },
      {
        q: "Do you publish the app to the stores?",
        a: "We prepare builds and listings and guide submission. Store accounts should be in your business's name.",
      },
      {
        q: "What does an app cost to run after launch?",
        a: "Hosting, store fees and maintenance for OS updates. We estimate these during planning.",
      },
    ],
    related: ["backend-api-development", "admin-panel-development", "custom-software-development"],
  },
  {
    slug: "custom-software-development",
    name: "Custom Software & SaaS",
    short: "Internal tools and SaaS products that fit how your business actually works.",
    icon: Boxes,
    title: "Custom Software & SaaS Development",
    metaDescription:
      "Custom software and SaaS development for small businesses and startups: internal tools, portals and workflow automation.",
    intro:
      "Spreadsheets and WhatsApp groups get a business surprisingly far — until they don't. We build custom software that replaces fragile manual processes with tools shaped around your workflow, and SaaS products for founders ready to launch.",
    benefits: [
      {
        title: "Fits your workflow",
        text: "Software follows your process instead of forcing a generic one.",
      },
      {
        title: "Start small",
        text: "We scope a first version that solves the most painful problem first.",
      },
      { title: "Own your system", text: "Your data, your code, documented for future developers." },
      { title: "Room to scale", text: "Sensible architecture so v2 doesn't mean starting over." },
    ],
    scope: [
      "Workflow mapping",
      "Role-based access",
      "Dashboards and reports",
      "Integrations with existing tools",
      "Multi-tenant SaaS foundations",
      "Documentation",
    ],
    deliverables: [
      "Working web application",
      "Database and admin access",
      "Technical documentation",
      "Deployment pipeline",
    ],
    process: [
      "Map the current process",
      "Define the first version",
      "Prototype key screens",
      "Build and iterate",
      "Roll out and train users",
    ],
    tech: ["Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
    faqs: [
      {
        q: "How do I know if I need custom software?",
        a: "If your team re-enters the same data in several places, or a process breaks when one person is away, it's worth a conversation.",
      },
      {
        q: "Can you work with my existing tools?",
        a: "Usually, if they offer an API or export. We check this early in discovery.",
      },
    ],
    related: ["backend-api-development", "admin-panel-development", "mobile-app-development"],
  },
  {
    slug: "backend-api-development",
    name: "Backend & API Development",
    short: "Secure, documented APIs and databases that power your apps and integrations.",
    icon: Server,
    title: "Backend & API Development",
    metaDescription:
      "Backend and REST API development with Python, FastAPI and PostgreSQL. Secure, documented APIs for web and mobile apps.",
    intro:
      "Every reliable app sits on a reliable backend. We design data models, build documented REST APIs and connect third-party services so your website, mobile app and internal tools share one source of truth.",
    benefits: [
      { title: "Clear data model", text: "A well-designed database that reflects your business." },
      {
        title: "Documented APIs",
        text: "Endpoints your team or future developers can understand.",
      },
      {
        title: "Security basics done right",
        text: "Authentication, validation, rate limiting and least-privilege access.",
      },
      { title: "Integrations", text: "Payments, messaging, CRMs and other third-party APIs." },
    ],
    scope: [
      "Database design and migrations",
      "REST API development",
      "Authentication and authorisation",
      "Third-party integrations",
      "Background jobs",
      "API documentation",
    ],
    deliverables: [
      "Deployed API",
      "Database schema and migrations",
      "API documentation",
      "Environment and deployment notes",
    ],
    process: [
      "Model the data",
      "Define endpoints and contracts",
      "Build with automated tests",
      "Secure and document",
      "Deploy and monitor",
    ],
    tech: ["Python", "FastAPI", "PostgreSQL", "Firebase", "REST APIs"],
    faqs: [
      {
        q: "Can you build an API for an existing app?",
        a: "Yes. We'll review the current app and data before proposing an approach.",
      },
      {
        q: "Do you write tests?",
        a: "Critical endpoints are covered with automated tests so changes don't break existing behaviour.",
      },
    ],
    related: ["admin-panel-development", "mobile-app-development", "custom-software-development"],
  },
  {
    slug: "admin-panel-development",
    name: "Admin Panel & Dashboard Development",
    short: "Dashboards that let your team manage content, orders, users and data safely.",
    icon: LayoutDashboard,
    title: "Admin Panel & Dashboard Development",
    metaDescription:
      "Admin panel and dashboard development: secure back-office tools to manage content, users, orders and reports.",
    intro:
      "An app is only as useful as the tools your team uses to run it. We build admin panels and dashboards that make everyday operations — editing content, handling orders, managing users — fast and safe.",
    benefits: [
      { title: "Role-based access", text: "Staff see and change only what they should." },
      {
        title: "Designed for daily use",
        text: "Search, filters and bulk actions where they save time.",
      },
      {
        title: "Useful reporting",
        text: "Dashboards built around the numbers you actually check.",
      },
      { title: "Audit-friendly", text: "Clear status changes and notes on records." },
    ],
    scope: [
      "User and role management",
      "Content and record editing",
      "Search and filtering",
      "Reports and exports",
      "File and media management",
      "Activity overviews",
    ],
    deliverables: ["Secure admin panel", "Role configuration", "User guide", "Source code"],
    process: [
      "List the daily tasks",
      "Design key screens",
      "Build on your backend",
      "Test permissions",
      "Train your team",
    ],
    tech: ["React", "Next.js", "TypeScript", "PostgreSQL"],
    faqs: [
      {
        q: "Can you add an admin panel to my existing website or app?",
        a: "Often yes, if the data is accessible through a database or API.",
      },
      {
        q: "Is it secure?",
        a: "Access is enforced on the server with authenticated sessions and role checks, not just hidden buttons.",
      },
    ],
    related: ["backend-api-development", "custom-software-development", "ecommerce-development"],
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing & Content Creation",
    short: "Content, social and campaign support that brings the right people to your site.",
    icon: Megaphone,
    title: "Digital Marketing & Content Creation",
    metaDescription:
      "Digital marketing and content creation for local businesses: website content, social media creatives and campaign landing pages.",
    intro:
      "A good website still needs people to visit it. We help businesses plan and create content — web copy, social posts, campaign landing pages — that reflects the brand and gives customers a reason to get in touch.",
    benefits: [
      {
        title: "Consistent brand",
        text: "Content that looks and sounds like one business across channels.",
      },
      { title: "Landing pages that convert", text: "Campaign pages focused on a single action." },
      { title: "Measured, not guessed", text: "Analytics set up so you can see what's working." },
      {
        title: "Realistic expectations",
        text: "No promised follower counts or overnight results.",
      },
    ],
    scope: [
      "Content strategy",
      "Website copywriting",
      "Social media creatives",
      "Campaign landing pages",
      "Analytics and conversion tracking",
      "Monthly reporting",
    ],
    deliverables: [
      "Content calendar",
      "Creatives and copy",
      "Landing pages",
      "Performance summary",
    ],
    process: [
      "Understand audience and offers",
      "Plan content themes",
      "Create and review",
      "Publish and measure",
      "Refine monthly",
    ],
    tech: ["Google Analytics", "Search Console", "Meta Business Suite"],
    faqs: [
      {
        q: "Do you run paid ads?",
        a: "We can build campaign landing pages and tracking. Ad management scope is agreed case by case.",
      },
      {
        q: "How soon will I see results?",
        a: "Content and organic channels take time. We focus on steady, measurable progress rather than promises.",
      },
    ],
    related: ["technical-seo", "website-development", "ecommerce-development"],
  },
  {
    slug: "technical-seo",
    name: "Technical SEO",
    short: "Fix the technical foundations that help search engines crawl and understand your site.",
    icon: SearchCheck,
    title: "Technical SEO Services",
    metaDescription:
      "Technical SEO audits and fixes: crawlability, Core Web Vitals, structured data, sitemaps and metadata. No ranking guarantees, just solid foundations.",
    intro:
      "Great content can't rank if search engines struggle to crawl it. We audit and fix the technical side of SEO — speed, indexing, metadata, structured data and site architecture — so your pages have a fair chance in search.",
    benefits: [
      { title: "Clear audit", text: "A prioritised list of issues in plain language." },
      { title: "Speed improvements", text: "Work on Core Web Vitals and page weight." },
      {
        title: "Better indexing",
        text: "Sitemaps, canonicals and robots rules configured correctly.",
      },
      { title: "Rich results eligibility", text: "Accurate structured data where it applies." },
    ],
    scope: [
      "Crawl and indexing audit",
      "Core Web Vitals review",
      "Metadata and headings",
      "Structured data",
      "Sitemap and robots.txt",
      "Search Console setup",
    ],
    deliverables: [
      "Audit report",
      "Implemented fixes",
      "Search Console configuration",
      "Before/after measurements",
    ],
    process: [
      "Crawl and measure",
      "Prioritise issues",
      "Implement fixes",
      "Validate in Search Console",
      "Monitor",
    ],
    tech: ["Search Console", "PageSpeed Insights", "Schema.org"],
    faqs: [
      {
        q: "Will technical SEO get me to #1 on Google?",
        a: "No one can promise that. Technical SEO removes obstacles; rankings also depend on content, competition and reputation.",
      },
      {
        q: "Can you work on a site you didn't build?",
        a: "Yes, if we get access to the code or CMS. Some platforms limit what can be changed.",
      },
    ],
    related: ["website-development", "digital-marketing", "website-maintenance"],
  },
  {
    slug: "website-maintenance",
    name: "Website Maintenance",
    short: "Updates, backups, monitoring and small changes so your site stays healthy.",
    icon: Wrench,
    title: "Website Maintenance & Support",
    metaDescription:
      "Website maintenance plans: updates, backups, security checks, uptime monitoring and content changes for business websites.",
    intro:
      "Websites need care after launch: dependencies age, content changes and things occasionally break. Our maintenance plans keep your site updated, backed up and working, with a direct line when you need a change.",
    benefits: [
      { title: "Fewer surprises", text: "Regular updates and checks catch issues early." },
      { title: "Backups", text: "A recovery path if something goes wrong." },
      {
        title: "Quick small changes",
        text: "Text, image and minor layout updates handled for you.",
      },
      { title: "Direct communication", text: "You talk to the person doing the work." },
    ],
    scope: [
      "Dependency and security updates",
      "Backup checks",
      "Uptime monitoring",
      "Content updates",
      "Form and integration checks",
      "Monthly summary",
    ],
    deliverables: ["Maintenance log", "Monthly health summary", "Agreed change hours"],
    process: [
      "Onboard and audit",
      "Set up monitoring",
      "Monthly updates",
      "Handle requests",
      "Review quarterly",
    ],
    tech: ["Uptime monitoring", "Version control", "Automated backups"],
    faqs: [
      {
        q: "Do you maintain sites you didn't build?",
        a: "Yes, after a short onboarding audit to understand how the site is built and hosted.",
      },
      {
        q: "Is maintenance a long contract?",
        a: "Plans are monthly with a clear scope. Terms are agreed in writing before starting.",
      },
    ],
    related: ["website-development", "technical-seo", "backend-api-development"],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
