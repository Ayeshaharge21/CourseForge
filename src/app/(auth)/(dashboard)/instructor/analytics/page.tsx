import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getAnalyticsData(instructorId: string) {
  try {
    // 1. Total Students Count
    const totalStudents = await prisma.enrollment.count({
      where: {
        course: { instructorId }
      }
    });

    // 2. Total Revenue Calculation
    const totalRevenueData = await prisma.payment.aggregate({
      where: {
        course: { instructorId },
        status: "SUCCESS"
      },
      _sum: {
        amount: true
      }
    });

    // 3. Total Courses Count
    const totalCourses = await prisma.course.count({
      where: { instructorId }
    });

    return {
      totalStudents,
      totalRevenue: totalRevenueData._sum.amount || 0,
      totalCourses
    };
  } catch (error) {
    console.error("Analytics Data Fetching Error:", error);
    return {
      totalStudents: 0,
      totalRevenue: 0,
      totalCourses: 0
    };
  }
}

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = session?.user?.id; // यदि आप क्लर्क यूज़ कर रहे हैं तो: const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const data = await getAnalyticsData(userId);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your course performance, revenue, and student growth.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>

        {/* Total Students Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        {/* Total Courses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Published materials</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Chart Card */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2 h-[300px] flex items-center justify-center border border-dashed m-4 rounded-lg bg-muted/40">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <BarChart3 className="h-8 w-8 animate-pulse" />
            <p className="text-sm">Chart visualization data loading...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
