import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { BookOpen, Users, BarChart3, Shield } from "lucide-react";
import Link from "next/link";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

const features = [
  {
    icon: BookOpen,
    title: "Create Courses",
    description: "Build and manage unlimited courses with video, quizzes, and resources.",
  },
  {
    icon: Users,
    title: "Manage Students",
    description: "Track enrollments, progress, and student engagement in one place.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "See revenue, completion rates, and performance with real-time data.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Accept global payments securely via integrated gateway solutions.",
  },
];

export default async function CourseOverviewPage({ params }: CoursePageProps) {
  const { id } = await params;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Console</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Managing Course ID: <span className="font-mono text-foreground bg-muted px-1.5 py-0.5 rounded text-xs">{id}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/instructor/courses">
            <Button variant="outline">Back to List</Button>
          </Link>
          <Link href={`/instructor/courses/${id}`}>
            <Button>Edit Details</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Card key={index} className="hover:shadow-sm transition">
              <CardHeader className="flex flex-row items-center space-x-4 pb-2 space-y-0">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
