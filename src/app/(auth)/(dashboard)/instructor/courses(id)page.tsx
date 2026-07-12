"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getCourseById(id: string, instructorId: string) {
  const course = await prisma.course.findUnique({
    where: { id, instructorId },
    include: {
      lessons: true,
      _count: { select: { enrollments: true }
    }
  });
  return course;
}

export default async function CourseDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await auth();
  if (!session?.user?.id) return <div>Please login</div>;

  const course = await getCourseById(params.id, session.user.id);
  
  if (!course) return <div>Course not found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/instructor/courses">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Course</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input id="title" defaultValue={course.title} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  defaultValue={course.description || ""} 
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label>Thumbnail</Label>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lessons ({course.lessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {course.lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground">No lessons yet</p>
              ) : (
                <div className="space-y-2">
                  {course.lessons.map((lesson) => (
                    <div key={lesson.id} className="p-3 border rounded-md">
                      {lesson.title}
                    </div>
                  ))}
                </div>
              )}
              <Button className="mt-4" variant="outline">+ Add Lesson</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Students:</span>
                <span className="font-bold">{course._count.enrollments}</span>
              </div>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-bold">₹{course.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-bold">{course.published ? "Published" : "Draft"}</span>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}