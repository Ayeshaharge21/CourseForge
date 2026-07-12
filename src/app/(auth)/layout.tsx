import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CourseForge Auth",
  description: "Login or Signup to CourseForge",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">CourseForge</h1>
          <p className="text-white/80 mt-2">Build. Teach. Earn.</p>
        </div>
        
        {/* Auth Card */}
        {children}
        
        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-8">
          © 2026 CourseForge. All rights reserved.
        </p>
      </div>
    </div>
  );
}