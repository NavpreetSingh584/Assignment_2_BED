export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export type BranchCreateDTO = Omit<Branch, "id" | "createdAt" | "updatedAt">;
export type BranchUpdateDTO = Partial<BranchCreateDTO>;
