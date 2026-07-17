"use server";

import { prisma as db } from "@/lib/prisma"; // import { db } from "@/lib/db"
import { auth } from "@/lib/auth"; ट
import { createLessonSchema } from "@/lib/validations"; 
import { revalidatePath } from "next/cache";

// 1. GET LESSON BY ID
export async function getLessonById(lessonId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    return await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true,
      },
    });
  } catch (error) {
    console.error("[GET_LESSON_BY_ID_ERROR]:", error);
    return null;
  }
}

// 2. CREATE LESSON - Instructor only
export async function createLesson(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    
    
    if (!session?.user?.id || session.user.role !== "INSTRUCTOR") {
      return { error: "Unauthorized access. Instructors only." };
    }

    const validatedFields = createLessonSchema.safeParse({
      title: formData.get("title"),
      content: formData.get("content"),
      courseId: formData.get("courseId"),
    });

    if (!validatedFields.success) {
      return {
        error: "Invalid fields. Please check your inputs.",
      };
    }

    const { title, content, courseId } = validatedFields.data;

    const lesson = await db.lesson.create({
      data: {
        title,
        content,
        courseId,
      },
    });

    revalidatePath(`/instructor/courses/${courseId}`);
    return { success: true, lessonId: lesson.id };
  } catch (error) {
    console.error("[CREATE_LESSON_ERROR]:", error);
    return { error: "Something went wrong while creating the lesson." };
  }
}
