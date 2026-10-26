// Server-only Firebase Admin SDK bootstrap. Dynamically imported from inside
// server function handlers only — never top-level-imported from a route file
// or *.functions.ts module, since the service account key is a secret.
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name} environment variable. See .env.example for the Firebase credentials this project needs.`,
    );
  }
  return value;
}

let _app: App | undefined;

function app(): App {
  if (_app) return _app;
  const existing = getApps();
  if (existing.length > 0) {
    _app = existing[0]!;
    return _app;
  }
  // FIREBASE_STORAGE_BUCKET is only needed if you actually use Firebase
  // Storage (media uploads). Firestore-only setups can leave it unset.
  const storageBucketEnv = process.env["FIREBASE_STORAGE_BUCKET"];
  _app = initializeApp({
    credential: cert({
      projectId: requireEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
      // The service account JSON's private key has literal "\n" sequences once
      // it's flattened into a single-line .env value — turn them back into
      // real newlines before handing it to the SDK.
      privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
    ...(storageBucketEnv ? { storageBucket: storageBucketEnv } : {}),
  });
  return _app;
}

export function firestore() {
  return getFirestore(app());
}

export function storageBucket() {
  // Only required at the point someone actually tries to use Storage.
  requireEnv("FIREBASE_STORAGE_BUCKET");
  return getStorage(app()).bucket();
}
