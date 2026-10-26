// One-off seed script. Run with: npm run db:seed
// Safe to re-run: it upserts by slug / id rather than blindly inserting.
try {
  process.loadEnvFile();
} catch {
  // .env not found — assume the vars are already in the environment
}
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import * as schema from "./schema";

const connectionString = process.env["DATABASE_URL"];
if (!connectionString) {
  console.error("Missing DATABASE_URL. Copy .env.example to .env and set it first.");
  process.exit(1);
}

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

const PROJECTS: (typeof schema.projects.$inferInsert)[] = [
  {
    slug: "rookatha",
    title: "Roo Katha",
    project_type: "Client project",
    category: "E-commerce",
    summary: "Brand site for a handwoven, slow-fashion Indian ethnic wear label.",
    body:
      "Roo Katha is a direct-to-consumer site for a handwoven, handcrafted Indian ethnic wear brand " +
      "based in Ahmedabad, built around sarees, lehengas, kurtis and festive wear with a focus on " +
      'slow, eco-conscious fashion — "luxury that doesn\'t cost the planet."\n\n' +
      'The homepage leads with a looping hero video and "The Story of Cotton," then walks through the ' +
      "brand's craft pillars (pure, honest fabric; fine tailoring; handwoven heritage), an Instagram reel " +
      "carousel, and a waitlist for the shop, which is launching in phases.",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    live_url: "https://rookatha.com/",
    cover_url: "/portfolio/rookatha-cover.jpg",
    gallery: [],
    seo_title: "Roo Katha — Slow Fashion Ethnic Wear | Novyra Digital",
    seo_description:
      "A brand website for Roo Katha, a handwoven slow-fashion label, built by Novyra Digital.",
    published: true,
    sort_order: 1,
  },
  {
    slug: "ramayan-the-epic",
    title: "Ramayana — The Epic",
    project_type: "Personal project",
    category: "Web app",
    summary: "A multilingual reading and devotional app for Valmiki's Ramayana.",
    body:
      "A web app that presents Valmiki's Ramayana shloka by shloka, with the original Sanskrit alongside " +
      "English, Hindi and Gujarati translations, organised into its six traditional kandas.\n\n" +
      'Beyond the text, it includes a "Shloka of the Day," devotional content around Hanuman Ji (Hanuman ' +
      "Chalisa, Sundarkand, Bajrang Baan with audio), a digital 108-bead Bhajan Mala for japa, character " +
      "profiles for figures like Rama, Sita, Lakshmana and Hanuman, plus search, favourites and language " +
      "switching.",
    technologies: ["Flutter", "Dart", "Firebase"],
    live_url: "https://ramayan-the-epic-battle.vercel.app/",
    cover_url: "/portfolio/ramayan-cover.jpg",
    gallery: [],
    seo_title: "Ramayana — The Epic | Novyra Digital",
    seo_description: "A multilingual Ramayana reading and devotional app, built by Novyra Digital.",
    published: true,
    sort_order: 2,
  },
];

async function main() {
  for (const project of PROJECTS) {
    const [existing] = await db
      .select({ id: schema.projects.id })
      .from(schema.projects)
      .where(eq(schema.projects.slug, project.slug));
    if (existing) {
      await db
        .update(schema.projects)
        .set({ ...project, updated_at: new Date() })
        .where(eq(schema.projects.id, existing.id));
      console.log(`Updated project: ${project.slug}`);
    } else {
      await db.insert(schema.projects).values(project);
      console.log(`Inserted project: ${project.slug}`);
    }
  }

  const [settings] = await db
    .select({ id: schema.siteSettings.id })
    .from(schema.siteSettings)
    .where(eq(schema.siteSettings.id, 1));
  if (!settings) {
    await db.insert(schema.siteSettings).values({ id: 1 });
    console.log("Inserted default site_settings row (id=1)");
  } else {
    console.log("site_settings row already exists, left untouched");
  }

  await client.end();
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
