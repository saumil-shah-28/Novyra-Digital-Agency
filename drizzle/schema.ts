import {
  pgTable,
  pgEnum,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
  serial,
} from "drizzle-orm/pg-core";

export const appRole = pgEnum("app_role", ["admin", "editor"]);
export const enquiryStatus = pgEnum("enquiry_status", [
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
  "spam",
]);

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  role: appRole("role").notNull().default("admin"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(), // opaque random token, looked up on every request
  user_id: uuid("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at", { withTimezone: true, mode: "string" }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  full_name: text("full_name").notNull(),
  business_name: text("business_name"),
  email: text("email").notNull(),
  whatsapp: text("whatsapp"),
  service: text("service").notNull(),
  budget: text("budget").notNull(),
  timeline: text("timeline").notNull(),
  description: text("description").notNull(),
  consent: boolean("consent").notNull().default(false),
  status: enquiryStatus("status").notNull().default("new"),
  notes: text("notes"),
  ip_hash: text("ip_hash"),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  body: text("body").notNull().default(""),
  category: text("category").notNull().default("Guides"),
  tags: text("tags").array().notNull().default([]),
  status: text("status").notNull().default("draft"),
  author_name: text("author_name").notNull().default("Novyra Digital"),
  cover_url: text("cover_url"),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  published_at: timestamp("published_at", { withTimezone: true, mode: "string" }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  category: text("category").notNull().default(""),
  project_type: text("project_type").notNull().default("Personal project"),
  technologies: text("technologies").array().notNull().default([]),
  live_url: text("live_url"),
  cover_url: text("cover_url"),
  gallery: text("gallery").array().notNull().default([]),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  published: boolean("published").notNull().default(false),
  sort_order: integer("sort_order").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  announcement_enabled: boolean("announcement_enabled").notNull().default(false),
  announcement_text: text("announcement_text").notNull().default(""),
  contact_email: text("contact_email"),
  contact_phone: text("contact_phone"),
  whatsapp_number: text("whatsapp_number"),
  service_area: text("service_area").notNull().default("Ahmedabad, Gujarat, India"),
  social_instagram: text("social_instagram"),
  social_linkedin: text("social_linkedin"),
  social_github: text("social_github"),
  social_x: text("social_x"),
  analytics_id: text("analytics_id"),
  default_meta_description: text("default_meta_description"),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
