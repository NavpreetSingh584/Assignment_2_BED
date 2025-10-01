export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  branchId: string | number;
  createdAt?: string;
  updatedAt?: string;
}
