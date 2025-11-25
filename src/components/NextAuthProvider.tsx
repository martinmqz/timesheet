"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * NextAuthProvider
 * Wraps the app in NextAuth's SessionProvider so that
 * session data is available via useSession() and getServerSession().
 */
export function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
