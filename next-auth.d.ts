// next-auth.d.ts
import NextAuth from 'next-auth';
import { Session } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    userId?: string;
  }
}
