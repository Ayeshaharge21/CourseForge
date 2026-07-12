"use server"

import { db } from "@/app/lib/db"
import { requireAuth, requireRole } from "@/app/lib/auth"
import { createCourseSchema, createLessonSchema } from "@/app/lib/validations"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// 1. GET COURSES
export async function getCourses() {
  return db.course.findMany({
    include: {
      _count: { select: { lessons: true, enrollments: true }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function getCourseById(courseId: string) {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
      enrollments: true
    }
  })
}

// 2. CREATE COURSE - Instructor only
export async function createCourse(prevState: any, formData: FormData) {
  const user = await requireRole("INSTRUCTOR")
  
  const validatedFields = createCourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    instructor: formData.get("instructor"),
    thumbnail: formData.get("thumbnail"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const course = await db.course.create({
    data: validatedFields.data
  })

  revalidatePath("/dashboard")
  redirect(`/courses/${course.id}`)
}

// 3. UPDATE COURSE
export async function updateCourse(courseId: string, formData: FormData) {
  await requireRole("INSTRUCTOR")

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    thumbnail: formData.get("thumbnail") as string,
  }

  await db.course.update({
    where: { id: courseId },
    data
  })

  revalidatePath(`/courses/${courseId}`)
  return { success: "Course updated" }
}

// 4. DELETE COURSE
export async function deleteCourse(courseId: string) {
  await requireRole("INSTRUCTOR")
  
  await db.course.delete({
    where: { id: courseId }
  })

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

// 5. ENROLL IN COURSE
export async function enrollInCourse(courseId: string) {
  const user = await requireAuth()

  await db.enrollment.create({
    data: {
      userId: user.id,
      courseId
    }
  }).catch(() => null) // ignore if already enrolled

  revalidatePath(`/courses/${courseId}`)
  return { success: "Enrolled successfully" }
}

// 6. ADD LESSON - Instructor only
export async function createLesson(prevState: any, formData: FormData) {
  await requireRole("INSTRUCTOR")

  const validatedFields = createLessonSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    order: formData.get("order"),
    courseId: formData.get("courseId"),
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  await db.lesson.create({
    data: validatedFields.data
  })

  revalidatePath(`/courses/${validatedFields.data.courseId}`)
  return { success: "Lesson created" }
}

// 7. MARK LESSON COMPLETE
export async function toggleLessonComplete(lessonId: string) {
  const user = await requireAuth()

  const existing = await db.progress.findUnique({
    where: { userId_lessonId: { userId: user.id, lessonId } }
  })

  if (existing) {
    await db.progress.update({
      where: { id: existing.id },
      data: { completed: !existing.completed }
    })
  } else {
    await db.progress.create({
      data: { userId: user.id, lessonId, completed: true }
    })
  }

  revalidatePath("/dashboard")
  return { success: "Progress updated" }
}

// 8. GET USER PROGRESS FOR A COURSE
export async function getCourseProgress(courseId: string) {
  const user = await requireAuth()
  
  const course = await getCourseById(courseId)
  if (!course) return 0

  const completedLessons = await db.progress.count({
    where: {
      userId: user.id,
      completed: true,
      lesson: { courseId }
    }
  })

  const totalLessons = course.lessons.length
  if (totalLessons === 0) return 0

  return Math.round((completedLessons / totalLessons) * 100)
}