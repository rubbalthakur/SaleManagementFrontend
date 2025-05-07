export interface User {
  userId: number;
  roleId: number;
  User: {
    emailId: string;
    firstName: string;
    lastName: string;
  };
  Role: {
    role: string;
  };
}
