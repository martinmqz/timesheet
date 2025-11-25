
import OAuthForm from "@/src/components/OAuthForm";
import { authOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/timesheets"); // block unauthenticated users
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100 pl-8 pr-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in</h1>
        <OAuthForm />
      
      </div>
    </div>
  );
}
