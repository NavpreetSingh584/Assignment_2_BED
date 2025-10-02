// src/config/firebaseConfig.ts
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

function initFirebase() {
  if (admin.apps.length) return; // already initialized

  // 1) Prefer Application Default Credentials via env var
  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gac) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    return;
  }

  // 2) Fallback to local JSON at project root
  const credPath = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(credPath)) {
    const serviceAccount = require(credPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
    });
    return;
  }

  // 3) If neither is present, fail loudly with instructions
  throw new Error(
    [
      "Firebase credentials not found.",
      "Set GOOGLE_APPLICATION_CREDENTIALS to an absolute path of your service account JSON, e.g.:",
      "  export GOOGLE_APPLICATION_CREDENTIALS=\"$(pwd)/firebase-service-account.json\"",
      "or place firebase-service-account.json at the repository root.",
    ].join("\n")
  );
}

// Initialize once
initFirebase();

// Only access services after init
export const db = admin.firestore();
export const auth = admin.auth();
