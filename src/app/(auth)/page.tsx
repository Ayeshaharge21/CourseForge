import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";
 
export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-slate-100">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2 text-blue-600">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to CourseForge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Choose an option to continue to your dashboard
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/login" passHref>
              <Button className="w-full">
                Login to Account
              </Button>
            </Link>
            
            <Link href="/signup" passHref>
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
