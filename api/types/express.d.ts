import { User } from '../../types/user';

declare global {
  namespace Express {
    interface Request {
      // Basic authenticated user shape used across the app
      user?: {
        id?: number | string;
        role?: string;
        [key: string]: any;
      };
    }
  }
}

export {};
