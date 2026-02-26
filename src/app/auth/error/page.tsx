import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg text-center">
        <h1 className="text-xl font-bold text-slate-800">Authentication Error</h1>
        <p className="mt-2 text-slate-600">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block font-medium text-indigo-600 hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
