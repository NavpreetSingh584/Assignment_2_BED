import { Branch, BranchCreateDTO, BranchUpdateDTO } from "../models/branch";
import * as repo from "../repositories/firestore.repository";

const COLLECTION = "branches";

export const create = async (dto: BranchCreateDTO): Promise<Branch> => {
  try {
    return await repo.createDocument<Branch>(COLLECTION, dto as any);
  } catch (e:any) {
    throw new Error("DB create failed: " + (e?.message ?? e));
  }
};

export const list = async (): Promise<Branch[]> => {
  try {
    return await repo.getDocuments<Branch>(COLLECTION);
  } catch (e:any) {
    throw new Error("DB read failed: " + (e?.message ?? e));
  }
};

export const getById = async (id: number | string): Promise<Branch | undefined> => {
  try {
    const doc = await repo.getDocumentById<Branch>(COLLECTION, String(id));
    return doc ?? undefined;
  } catch (e:any) {
    throw new Error("DB read failed: " + (e?.message ?? e));
  }
};

export const update = async (id: number | string, patch: BranchUpdateDTO): Promise<Branch | undefined> => {
  try {
    const updated = await repo.updateDocument<Branch>(COLLECTION, String(id), patch);
    return updated ?? undefined;
  } catch (e:any) {
    throw new Error("DB update failed: " + (e?.message ?? e));
  }
};

export const remove = async (id: number | string): Promise<boolean> => {
  try {
    return await repo.deleteDocument(COLLECTION, String(id));
  } catch (e:any) {
    throw new Error("DB delete failed: " + (e?.message ?? e));
  }
};
