import { db } from "@/lib/db"; 
import { auth } from "@/lib/auth"; 
import { NextResponse } from "next/server";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/courses/[id] 
export async function GET(req: Request, context: Context) {
  try {
    
    const { id } = await context.params;

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: id,
        instructorId: session.user.id, 
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_GET_ERROR]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
