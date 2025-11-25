"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to Timesheet App</h1>
        <p className="text-lg text-gray-400">
          Track your work hours and line items with ease.
        </p>

        {/* Link to protected route */}
        <Link
          href="/timesheets"
          className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold"
        >
          Go to Timesheets
        </Link>

        {/* Status message */}
        {status === "authenticated" ? (
          <p className="text-green-400 mt-4">
            You are logged in as {session?.user?.email}.
          </p>
        ) : (
          <p className="text-red-400 mt-4">
            Login required to access timesheets.
          </p>
        )}
      </div>
    </div>
  );
}