import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CourseForge Auth",
  description: "Login or Signup to CourseForge",
};

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">CourseForge</h1>
          <p className="text-white/80 mt-2 text-sm">Build. Teach. Earn.</p>
        </div>

        {/* Auth Cards / Content */}
        <div className="w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
