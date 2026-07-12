import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, BookOpen, DollarSign, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getDashboardData(instructorId: string) {
  const [totalCourses, totalStudents, totalRevenue] = await Promise.all([
    prisma.course.count({ where: { instructorId } }),
    prisma.enrollment.count({ where: { course: { instructorId } } }),
    prisma.payment.aggregate({
      where: { course: { instructorId }, status: "SUCCESS" },
      _sum: { amount: true }
    })
  ]);

  const recentCourses = await prisma.course.findMany({
    where: { instructorId },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      _count: { select: { enrollments: true } }
    }
  });

  return {
    totalCourses,
    totalStudents,
    totalRevenue: totalRevenue._sum.amount || 0,
    recentCourses
  };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Please login</div>;

  const data = await getDashboardData(session.user.id);

  const stats = [
    {
      title: "Total Courses",
      value: data.totalCourses,
      icon: BookOpen,
      color: "text-blue-500"
    },
    {
      title: "Total Students",
      value: data.totalStudents,
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue}`,
      icon: DollarSign,
      color: "text-yellow-500"
    },
    {
      title: "Analytics",
      value: "View",
      icon: BarChart3,
      color: "text-purple-500"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Here’s what’s happening with your courses</p>
        </div>
        <Link href="/dashboard/instructor/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentCourses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">No courses yet. Create your first one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentCourses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course._count.enrollments} students
                    </p>
                  </div>
                  <Link href={`/dashboard/instructor/courses/${course.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}