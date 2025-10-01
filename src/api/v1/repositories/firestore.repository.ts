import { db } from "../../../config/firebaseConfig";

export const createDocument = async <T extends Record<string, any>>(
  collection: string, data: T
) => {
  const now = new Date().toISOString();
  const docRef = await db.collection(collection).add({ ...data, createdAt: now, updatedAt: now });
  const snap = await docRef.get();
  return { id: docRef.id, ...(snap.data() as T) };
};

export const getDocuments = async <T>(collection: string) => {
  const snap = await db.collection(collection).get();
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as T) }));
};

export const getDocumentById = async <T>(collection: string, id: string) => {
  const doc = await db.collection(collection).doc(id).get();
  return doc.exists ? ({ id: doc.id, ...(doc.data() as T) }) : null;
};

export const updateDocument = async <T>(
  collection: string, id: string, data: Partial<T>
) => {
  const ref = db.collection(collection).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  const updated = { ...doc.data(), ...data, updatedAt: new Date().toISOString() };
  await ref.set(updated, { merge: true });
  return { id, ...(updated as T) };
};

export const deleteDocument = async (collection: string, id: string) => {
  const ref = db.collection(collection).doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
};
