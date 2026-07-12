"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getInstructorCourses(instructorId: string) {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    include: {
      _count: {
        select: { enrollments: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return courses;
}

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user?.id) return <div>Please login</div>;

  const courses = await getInstructorCourses(session.user.id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Courses</h1>
        <Link href="/dashboard/instructor/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No courses yet</h3>
            <p className="text-sm text-muted-foreground">Start creating your first course</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description || "No description"}
                </p>
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{course._count.enrollments} Students</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Link href={`/dashboard/instructor/courses/${course.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}