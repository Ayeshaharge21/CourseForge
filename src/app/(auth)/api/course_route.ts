import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// GET /api/courses/[id] - Get single course
export async function GET(
  req: Request,
  { params }: { params: { id: string }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const course = await prisma.course.findUnique({
    where: { 
      id: params.id,
      instructorId: session.user.id // security: only owner can see
    },
    include: {
      lessons: {
        orderBy: { order: "asc" }
      },
      _count: {
        select: { enrollments: true }
      }
    }
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

// PATCH /api/courses/[id] - Update course
export async function PATCH(
  req: Request,
  { params }: { params: { id: string }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, price, published, thumbnail } = body;

  const course = await prisma.course.update({
    where: {
      id: params.id,
      instructorId: session.user.id // security: only owner can update
    },
    data: {
      title,
      description,
      price,
      published,
      thumbnail
    }
  });

  return NextResponse.json(course);
}

// DELETE /api/courses/[id] - Delete course
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.course.delete({
    where: {
      id: params.id,
      instructorId: session.user.id // security: only owner can delete
    }
  });

  return NextResponse.json({ message: "Course deleted successfully" });
}