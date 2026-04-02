import type { UserRole } from "@fielddoor/shared";

export interface AuthUser {
  id: string;
  phone: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
