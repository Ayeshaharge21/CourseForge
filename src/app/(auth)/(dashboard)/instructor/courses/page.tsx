import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { Button } from "../../../../../../components/ui/button";
import { Plus, BookOpen, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { auth } from "../../../../../../lib/auth";
import { prisma } from "../../../../../../lib/prisma";
import { redirect } from "next/navigation";


async function getInstructorCourses(instructorId: string) {
  try {
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return courses;
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    return [];
  }
}

export default async function CoursesPage() {
  const session = await auth();
  const userId = session?.user?.id; // const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await getInstructorCourses(userId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Manage your published courses and create new curriculum.
          </p>
        </div>
        <Link href="/instructor/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed rounded-lg p-12 bg-muted/20 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No courses found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-4">
            You haven&apos;t created any courses yet. Get started by clicking the button above.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-lg font-bold truncate max-w-[200px]">
                  {course.title}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Link href={`/instructor/courses/${course.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-x-4 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course._count.enrollments} Students</span>
                  </div>
                  <div className="font-semibold text-foreground">
                    {course.price ? `$${course.price}` : "Free"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
