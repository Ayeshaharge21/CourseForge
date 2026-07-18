import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { BarChart3, Users, BookOpen, DollarSign, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { redirect } from "next/navigation";


async function getDashboardData(instructorId: string) {
  try {
    const [totalCourses, totalStudents, totalRevenueData] = await Promise.all([
      prisma.course.count({ where: { instructorId } }),
      prisma.enrollment.count({ where: { course: { instructorId } } }),
      prisma.payment.aggregate({
        where: { course: { instructorId }, status: "SUCCESS" },
        _sum: { amount: true },
      }),
    ]);

    const recentCourses = await prisma.course.findMany({
      where: { instructorId },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
    });

    return {
      totalCourses,
      totalStudents,
      totalRevenue: totalRevenueData._sum.amount || 0,
      recentCourses,
    };
  } catch (error) {
    console.error("Dashboard Data Fetching Error:", error);
    return {
      totalCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      recentCourses: [],
    };
  }
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id; 

  if (!userId) {
    return redirect("/");
  }

  const data = await getDashboardData(userId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here is an overview of your instructor profile.
          </p>
        </div>
        <Link href="/instructor/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Course
          </Button>
        </Link>
      </div>

      {/* स्टेट्स ग्रिड (Stats Grid) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCourses}</div>
          </CardContent>
        </Card>
      </div>

      {/* (Recent Courses) */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Courses</h2>
        {data.recentCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-8 text-center bg-muted/20">
            <p className="text-sm text-muted-foreground">You haven&apos;t created any courses yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.recentCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle className="text-base font-bold truncate">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {course._count.enrollments} Enrolled
                  </span>
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Button variant="ghost" size="sm" className="gap-1 text-blue-500">
                      Manage <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
