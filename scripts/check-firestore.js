// scripts/check-firestore.js

const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

(async () => {
  try {
    const db = admin.firestore();
    await db.collection('healthcheck').doc().set({
      ok: true,
      ts: new Date().toISOString(),
    });
    console.log('OK');
    process.exit(0);
  } catch (err) {
    console.error('ERR', err.code, err.details || err.message);
    process.exit(1);
  }
})();
