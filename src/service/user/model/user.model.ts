export namespace UserApi {
  export interface Response {
    id: string;
    username: string;
    name: string;
    dob: string | null;
    idNumber: string | null;
    gender: number;
    createdAt: string;
    createdBy: string | null;
    updatedAt: string;
    updatedBy: string | null;
    userRole: UserRole;
    userStatus: 'ACTIVATE' | 'INACTIVE' | string;
  }
  export interface UserRole {
    id: string;
    role: string;            // ví dụ: "ROLE_USER", "ROLE_ADMIN"
    roleReference: string;   // ví dụ: "USER"
    description: string | null;
    createdAt: string;
    updatedAt: string;
  }
}
