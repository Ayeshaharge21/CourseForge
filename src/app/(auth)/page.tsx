import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <CardTitle className="text-2xl">Welcome to CourseForge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Choose an option to continue</p>
          
          <Link href="/auth/login">
            <Button className="w-full">Login</Button>
          </Link>
          
          <Link href="/auth/signup">
            <Button variant="outline" className="w-full">Create Account</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}