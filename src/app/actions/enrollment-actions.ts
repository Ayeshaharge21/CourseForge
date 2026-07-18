"use server";

import { prisma as db } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";
import { revalidatePath } from "next/cache";

// 1. ENROLL IN A COURSE
export async function enrollInCourse(courseId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "You must be logged in to enroll." };
    }

    
    const existing = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existing) {
      return { error: "You are already enrolled in this course." };
    }

   
    await db.enrollment.create({
      data: {
        userId,
        courseId,
      },
    });

    
    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error) {
    console.error("[ENROLL_COURSE_ERROR]:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
