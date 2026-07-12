import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, Shield } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Create Courses",
    description: "Build and manage unlimited courses with video, quizzes, and resources"
  },
  {
    icon: Users,
    title: "Manage Students", 
    description: "Track enrollments, progress, and student engagement in one place"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "See revenue, completion rates, and performance with real-time data"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Accept payments and get paid directly with built-in payment gateway"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 py-24 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">
            Build Your Course Empire with CourseForge
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            The all-in-one platform for instructors to create, sell, and scale online courses
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need to Teach Online
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start teaching?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of instructors already using CourseForge
          </p>
          <Link href="/signup">
            <Button size="lg">Create Your First Course</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 CourseForge. Built with Next.js + Prisma + shadcn/ui</p>
      </footer>
    </div>
  );
}