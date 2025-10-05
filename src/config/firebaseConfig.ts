import admin from "firebase-admin";
import fs from "fs";
import path from "path";

function initFirebase() {
  if (admin.apps.length) return;

  const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const defaultPath = path.join(process.cwd(), "firebase-service-account.json");
  const keyPath = [envPath, defaultPath].find(p => p && fs.existsSync(p!));

  if (!keyPath) {
    throw new Error("Missing Firebase credentials file.");
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sa = require(keyPath);

  // make the project id visible to all google libs
  process.env.GOOGLE_CLOUD_PROJECT = sa.project_id;
  process.env.GCLOUD_PROJECT = sa.project_id;

  admin.initializeApp({
    credential: admin.credential.cert(sa as admin.ServiceAccount),
    projectId: sa.project_id,
  });

  console.log("[firebase] using:", sa.client_email, "project:", sa.project_id);
}

initFirebase();

export const db = admin.firestore();
export const auth = admin.auth();
