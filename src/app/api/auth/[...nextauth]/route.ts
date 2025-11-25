import NextAuth from "next-auth";
import { authOptions } from "@/src/lib/auth";

/**
 * NextAuth API Route
 * Handles authentication endpoints for sign-in, sign-out, session, and provider callbacks.
 * Must export both GET and POST handlers so NextAuth can process requests correctly.
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };