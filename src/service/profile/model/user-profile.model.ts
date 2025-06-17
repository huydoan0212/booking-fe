export interface UserRole {
  id: string;
  role: string;
  roleReference: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  dob: string | null;
  idNumber: string | null;
  gender: number;
  userStatus: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  userRole: UserRole;
}
