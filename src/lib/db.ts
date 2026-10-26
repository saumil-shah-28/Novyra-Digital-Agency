// Server-only: direct Postgres connection via Drizzle.
// Never top-level import this from a route file or a *.functions.ts module
// (those ship to the client bundle) — always `await import("@/lib/db")`
// inside a server function handler instead, the same pattern used for the
// old Supabase service-role client.
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "../../drizzle/schema";

function createDb() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error(
      "Missing DATABASE_URL environment variable. Set it to your local Postgres connection string, e.g. " +
        "postgres://user:password@localhost:5432/novyra_digital",
    );
  }
  const client = postgres(connectionString, { max: 5 });
  return drizzle(client, { schema });
}

let _db: ReturnType<typeof createDb> | undefined;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

export { schema };
