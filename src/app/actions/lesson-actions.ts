"use server"

import { db } from "@/app/lib/db"
import { requireRole, requireAuth } from "@/app/lib/auth"
import { createLessonSchema } from "@/app/lib/validations"
import { revalidatePath } from "next/cache"

// 1. GET LESSON BY ID
export async function getLessonById(lessonId: string) {
  return db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: true
    }
  })
}

// 2. CREATE LESSON - Instructor only
export async function createLesson(prevState: any, formData: FormData) {
  await requireRole("INSTRUCTOR")

  const validatedFields = createLessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"), // can be markdown or youtube url
    order: formData.get("order"),
    courseId: formData.get("courseId"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const lesson = await db.lesson.create({
    data: validatedFields.data
  })

  revalidatePath(`/courses/${validatedFields.data.courseId}`)
  return { success: "Lesson created", lessonId: lesson.id }
}

// 3. UPDATE LESSON
export async function updateLesson(lessonId: string, formData: FormData) {
  await requireRole("INSTRUCTOR")

  const data = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    order: Number(formData.get("order")),
  }

  const lesson = await db.lesson.update({
    where: { id: lessonId },
    data
  })

  revalidatePath(`/courses/${lesson.courseId}`)
  revalidatePath(`/lesson/${lessonId}`)
  return { success: "Lesson updated" }
}

// 4. DELETE LESSON
export async function deleteLesson(lessonId: string) {
  await requireRole("INSTRUCTOR")
  
  const lesson = await db.lesson.findUnique({ where: { id: lessonId } })
  if (!lesson) return { error: "Lesson not found" }

  await db.lesson.delete({ where: { id: lessonId } })

  revalidatePath(`/courses/${lesson.courseId}`)
  return { success: "Lesson deleted" }
}

// 5. REORDER LESSONS
export async function reorderLessons(courseId: string, lessonIds: string[]) {
  await requireRole("INSTRUCTOR")

  const updates = lessonIds.map((id, index) => 
    db.lesson.update({
      where: { id },
      data: { order: index + 1 }
    })
  )

  await db.$transaction(updates)
  revalidatePath(`/courses/${courseId}`)
  return { success: "Lessons reordered" }
}

// 6. GET NEXT / PREV LESSON
export async function getNextLesson(courseId: string, currentOrder: number) {
  return db.lesson.findFirst({
    where: { courseId, order: { gt: currentOrder } },
    orderBy: { order: "asc" }
  })
}

export async function getPrevLesson(courseId: string, currentOrder: number) {
  return db.lesson.findFirst({
    where: { courseId, order: { lt: currentOrder } },
    orderBy: { order: "desc" }
  })
}