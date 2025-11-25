
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { prisma } from "@/src/lib/prisma";
import getRequiredEnv from "../utils/getRequiredEnv";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: getRequiredEnv("GOOGLE_CLIENT_ID"),
      clientSecret: getRequiredEnv("GOOGLE_CLIENT_SECRET"),
    }),
    GitHubProvider({
      clientId: getRequiredEnv("GITHUB_ID"),
      clientSecret: getRequiredEnv("GITHUB_SECRET"),
    }),
  ],
  session: {
    strategy: "jwt", // or "database" if you want persisted sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // attach user.id to JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string; // expose user.id in session
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};