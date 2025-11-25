'use client'

import { signIn } from "next-auth/react";

export default function OAuthForm() {
  return (
    <>
      {/* Google sign-in */}
      <button
        onClick={() => signIn("google")}
        className="w-full mb-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
      >
        Continue with Google
      </button>

      {/* GitHub sign-in */}
      <button
        onClick={() => signIn("github")}
        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
      >
        Continue with GitHub
      </button>
    </>
  );
}
