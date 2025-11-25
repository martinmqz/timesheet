import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/src/components/NextAuthProvider";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timesheet App",
  description: "Track work hours and line items with Next.js + Prisma",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        {/* Wrap the whole app in NextAuthProvider so useSession() works */}
        <NextAuthProvider>
          <main className="min-h-screen flex flex-col">
            {/* Global header */}
            <header className="border-b border-gray-700 bg-gray-800 shadow-sm">
              <div className="mx-auto max-w-7xl px-4 py-3 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-white">
                  Timesheet App
                </h1>
              </div>
            </header>

            {/* Page content */}
            <section className="mx-auto max-w-7xl px-4 py-6 flex-1">
              {children}
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-700 bg-gray-800 py-4 text-center text-sm text-gray-400">
              © {new Date().getFullYear()} Timesheet App - by MartinMQZ
            </footer>
          </main>
        </NextAuthProvider>
        <Image
          src="https://martinstack.dev/pixel/?timesheet-app"
          alt=""
          width={1}
          height={1}
          priority
          unoptimized
        />
      </body>
    </html>
  );
}
