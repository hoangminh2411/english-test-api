// types/express.d.ts
import express from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number; // or string depending on your JWT structure
        isAdmin: boolean;
        // Add other user properties as needed
      };
    }
  }
}
