"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console / Sentry
    console.error("Auth Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-600 p-4">
      <Card className="w-full max-w-md border-red-200">
        <CardHeader className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-600" />
          <CardTitle className="text-2xl text-red-600">Something went wrong</CardTitle>
          <CardDescription>
            We couldn't load the authentication page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border-red-200 rounded-md p-3">
            <p className="text-sm text-red-800 font-mono">
              {error.message || "Unknown error"}
            </p>
          </div>

          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>

          <Button variant="outline" onClick={() => window.location.href = "/"} className="w-full">
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}