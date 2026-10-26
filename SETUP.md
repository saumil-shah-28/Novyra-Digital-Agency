# Setup — Postgres, Firebase & Resend

This project no longer uses Supabase. It now runs on:

- **Postgres** (via Drizzle ORM) for all data: enquiries, posts, projects, site settings, and the admin login.
- **Firebase** for media storage (Firebase Storage) and as a second copy of every enquiry (Firestore).
- **Resend** to email you when a new enquiry comes in.
- **Custom email/password auth** for `/admin`, stored in your own Postgres (no third-party auth provider).

Everything below is driven by `.env` in the project root. Copy `.env.example` to `.env` if you ever need a fresh template (`.env` itself is git-ignored so your real credentials never get committed).

## 1. Postgres (local)

Install Postgres locally if you don't have it already — either:

- **Postgres.app** (simplest on macOS): https://postgresapp.com — install, press "Initialize", done.
- or Homebrew: `brew install postgresql@16 && brew services start postgresql@16`
- or Docker: `docker run --name novyra-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16`

Then create the database:

```
createdb novyra_digital
```

(With Docker instead: `docker exec -it novyra-pg createdb -U postgres novyra_digital`)

Set `DATABASE_URL` in `.env` to match — the default already in `.env` assumes a local Postgres with user/password `postgres`:

```
DATABASE_URL="postgres://postgres:postgres@localhost:5432/novyra_digital"
```

Adjust the user/password/port if yours differ.

Then, from the project root (run these in your own Terminal on your Mac, not anywhere else):

```
npm install
npm run db:push    # creates all tables from drizzle/schema.ts
npm run db:seed    # adds the default site settings row + the ROOKATHA and Ramayan projects
npm run dev
```

Open `http://localhost:3000/admin/login` and use "First time? Create the admin account" to create your own login — the first account created becomes the site admin.

(`npm run db:generate` regenerates the SQL migration in `drizzle/migrations` if you ever change `drizzle/schema.ts`; `npm run db:studio` opens Drizzle's DB browser UI.)

## 2. Firebase (Firestore enquiry mirror)

This project uses Firebase for one thing only, by default: every new enquiry also gets written to a `enquiries` collection in Firestore, as a second copy (Postgres stays the source of truth for the admin panel either way). Firebase **Storage** is optional and only needed if you later want media uploads (`/admin/media`, project cover/gallery images) to go to Firebase instead of staying unconfigured — skip step 3 below if you don't need that.

1. Go to https://console.firebase.google.com → **Add project** → name it (e.g. "novyra-digital") → finish the wizard (Google Analytics is optional, you can skip it).
2. In the left sidebar: **Build → Firestore Database → Create database** → start in **production mode** → pick a region close to you.
3. *(Optional — only if you want Firebase Storage for media uploads)* In the left sidebar: **Build → Storage → Get started** → start in **production mode**.
4. Click the gear icon → **Project settings → Service accounts → Generate new private key**. This downloads a JSON file — keep it secret, never commit it.
5. From that JSON file, fill in `.env`:
   - `FIREBASE_PROJECT_ID` ← the JSON's `project_id`
   - `FIREBASE_CLIENT_EMAIL` ← the JSON's `client_email`
   - `FIREBASE_PRIVATE_KEY` ← the JSON's `private_key`, pasted as-is (it contains `\n` sequences — the app converts those back to real newlines automatically, just paste the whole quoted string)
   - `FIREBASE_STORAGE_BUCKET` ← leave this **blank** if you skipped step 3 (Firestore-only). Only fill it in if you enabled Storage — from **Project settings → General → Your apps**, or typically `<project-id>.appspot.com` / `<project-id>.firebasestorage.app`.

Once the first three are set, every new enquiry gets mirrored into Firestore automatically. Media uploads will only work once `FIREBASE_STORAGE_BUCKET` is also set.

## 3. Resend (enquiry email notifications)

1. Sign up at https://resend.com and go to **API Keys → Create API Key**.
2. Put it in `.env` as `RESEND_API_KEY`.
3. For `RESEND_FROM_EMAIL`: to start immediately without any setup you can leave the default `Novyra Digital <onboarding@resend.dev>` — Resend's shared testing address, which only delivers to your own verified Resend account email. To send to any address (e.g. your real `contact_email` in Settings) once you're ready, verify a domain under **Domains** in Resend, then change `RESEND_FROM_EMAIL` to an address on that domain, e.g. `Novyra Digital <enquiries@novyra.digital>`.
4. Make sure a **contact email** is set under `/admin/settings` → that's the address enquiry notifications are sent to.

If `RESEND_API_KEY` is left blank, the site still works — enquiries still save to Postgres and mirror to Firestore, it just skips sending the email and logs a warning in the server console.

## Notes

- Always run `npm install` (and `npm run dev`/`npm run build`) from your own Mac Terminal, in this folder. Don't reuse a `node_modules` that was installed somewhere else — it contains platform-specific native binaries (esbuild, rolldown) that won't run on a different OS/architecture.
- If `npm install` ever fails with `Cannot read properties of null (reading 'edgesOut')`, that's an unrelated npm/arborist bug — delete `node_modules` and `package-lock.json` and run `npm install --legacy-peer-deps` instead.
- The project folder was moved from Downloads into `~/Documents/novyra-digital`; the old Downloads folder is now empty and safe to delete.
- `npm run build` and `npx tsc --noEmit` both passed cleanly against this rewrite (verified from a Linux dev sandbox before handing the project back) — run them again after your first local `npm install` to confirm on your own machine too.
