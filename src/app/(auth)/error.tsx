"use client";

import { useEffect } from "react";
import { Button } from "../../components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  useEffect(() => {

    console.error("[AUTH_ROUTE_ERROR]:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md w-full border border-slate-100">
        <h2 className="text-2xl font-bold text-rose-600 mb-2">
          Something went wrong!
        </h2>
        <p className="text-sm text-slate-500 mb-6 bg-slate-50 p-3 rounded font-mono break-all">
          {error.message || "An unexpected authentication error occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
