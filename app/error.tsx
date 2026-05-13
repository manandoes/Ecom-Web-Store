"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service like Sentry
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-medium mb-4">Something went wrong</h1>
      <p className="text-[#8b8b8b] max-w-md mb-8">
        We apologize for the inconvenience. An unexpected error has occurred. Our team has been notified.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={reset}
          className="h-12 px-6 rounded-full bg-amber-500 text-black font-medium flex items-center justify-center hover:bg-amber-400 transition-colors gap-2"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="h-12 px-6 rounded-full border border-[#2a2a2e] text-white font-medium flex items-center justify-center hover:bg-[#1a1a1e] transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
