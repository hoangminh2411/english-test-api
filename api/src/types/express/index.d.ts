import express from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        isAdmin: boolean;
        // Add other user properties as needed
      };
    }
  }
}
