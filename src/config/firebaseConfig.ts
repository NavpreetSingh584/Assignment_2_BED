import admin from "firebase-admin";
import path from "path";

if (!admin.apps.length) {


  // Prefer GOOGLE_APPLICATION_CREDENTIALS env; fallback to local file if present



  try {
    admin.initializeApp({
      credential: process.env.GOOGLE_APPLICATION_CREDENTIALS
        ? admin.credential.applicationDefault()
        : admin.credential.cert(



            // If you prefer hardcoding a filename at repo root:


            
            
            require(path.join(process.cwd(), "firebase-service-account.json"))
          ),
    });
  } catch (e) {

    // If running tests with mocks, this can be safely ignored
    
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
