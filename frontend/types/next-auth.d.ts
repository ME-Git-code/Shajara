import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    backendToken?: string;
    userId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    googleIdToken?: string;
    backendToken?: string;
    userId?: string;
  }
}
