import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getAnalyticsData(instructorId: string) {
  const totalStudents = await prisma.enrollment.count({
    where: { course: { instructorId } }
  });

  const totalRevenue = await prisma.payment.aggregate({
    where: { course: { instructorId }, status: "SUCCESS" },
    _sum: { amount: true }
  });

  const totalCourses = await prisma.course.count({
    where: { instructorId }
  });

  return {
    totalStudents,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalCourses
  };
}

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Please login</div>;

  const data = await getAnalyticsData(session.user.id);

  const stats = [
    {
      title: "Total Students",
      value: data.totalStudents,
      icon: Users,
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue}`,
      icon: DollarSign,
    },
    {
      title: "Total Courses",
      value: data.totalCourses,
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Instructor Analytics</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}