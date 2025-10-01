export interface Employee {
  id: string;                 // Firestore will give string IDs later
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  branchId: string | number;
  createdAt?: string;
  updatedAt?: string;
}

/** For POST /employees */
export type EmployeeCreateDTO = Omit<Employee, "id" | "createdAt" | "updatedAt">;

/** For PUT /employees/:id */
export type EmployeeUpdateDTO = Partial<EmployeeCreateDTO>;
