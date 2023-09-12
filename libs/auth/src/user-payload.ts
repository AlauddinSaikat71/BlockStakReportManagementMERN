export interface UserRole {
  id: number;

  role: string;
}
export class UserPayload {
  id: number;

  email: string;

  firstName: string;

  lastName: string;

  roleId: number;

  role: UserRole;

  constructor(partial?: Partial<UserPayload>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
