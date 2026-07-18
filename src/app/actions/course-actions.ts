"use server";

import { prisma as db } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function getCourses() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    return await db.course.findMany({
      where: {
        instructorId: session.user.id
      },
      include: {
        _count: {
          select: { 
            lessons: true, 
            enrollments: true 
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  } catch (error) {
    console.error("[GET_COURSES_ACTION_ERROR]:", error);
    return [];
  }
}


export async function getCourseById(courseId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        instructorId: session.user.id
      },
      include: {
        lessons: {
          orderBy: {
            order: "asc" 
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    return course;
  } catch (error) {
    console.error("[GET_COURSE_BY_ID_ACTION_ERROR]:", error);
    return null;
  }
}
