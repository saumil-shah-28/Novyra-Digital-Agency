<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Architecture

- Service and local landing page copy lives in src/lib/services.ts and route files (hand-written so each page stays unique); projects, posts, settings and enquiries live in Postgres (via Drizzle, see drizzle/schema.ts) and are edited from /admin.
- Database access always goes through a dynamic `await import("@/lib/db")` inside a server function handler — never a top-level import in a route file or *.functions.ts module — so the Postgres connection string never reaches the client bundle. The same pattern applies to `@/lib/firebase/admin`.
- Auth is custom email/password, stored in the `admin_users` and `sessions` tables (src/lib/auth/). Sessions are an opaque token in an httpOnly cookie, looked up per request — there is no third-party auth provider. The first account created via /admin/login becomes the (only) admin.
- Media uploads go to Firebase Storage via the Admin SDK (src/lib/firebase/storage.ts), returned as long-lived signed URLs; the bucket itself stays private.
- Every new enquiry is written to Postgres (source of truth for /admin), mirrored into a Firestore `enquiries` collection, and emailed to the site's contact_email via Resend — see src/lib/contact.functions.ts.
- Public reads go through server functions in src/lib/data.functions.ts, which query Postgres directly (no public API key involved, unlike the old Supabase setup).
- See SETUP.md for how to configure Postgres, Firebase and Resend for local development.
