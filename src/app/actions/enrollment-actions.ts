"use server"

import { db } from "@/app/lib/db"
import { requireAuth } from "@/app/lib/auth"
import { revalidatePath } from "next/cache"

// 1. ENROLL IN A COURSE
export async function enrollInCourse(courseId: string) {
  const user = await requireAuth()

  // Check if already enrolled
  const existing = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId }
  })

  if (existing) {
    return { error: "You are already enrolled in this course" }
  }

  await db.enrollment.create({
    data: {
      userId: user.id,
      courseId
    }
  })

  revalidatePath(`/courses/${courseId}`)
  revalidatePath("/dashboard")
  return { success: "Enrolled successfully" }
}

// 2. UNENROLL FROM A COURSE
export async function unenrollFromCourse(courseId: string) {
  const user = await requireAuth()

  await db.enrollment.delete({
    where: { userId_courseId: { userId: user.id, courseId } }
  })

  // Also delete all progress for this course
  await db.progress.deleteMany({
    where: {
      userId: user.id,
      lesson: { courseId }
    }
  })

  revalidatePath("/dashboard")
  revalidatePath(`/courses/${courseId}`)
  return { success: "Unenrolled successfully" }
}

// 3. GET ALL USER ENROLLMENTS
export async function getUserEnrollments() {
  const user = await requireAuth()

  return db.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          _count: { select: { lessons: true } }
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  })
}

// 4. CHECK IF USER IS ENROLLED
export async function isEnrolled(courseId: string) {
  const user = await requireAuth()

  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } }
  })

  return !!enrollment
}

// 5. MARK LESSON AS COMPLETE / INCOMPLETE
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
    revalidatePath("/dashboard")
    return { success: "Progress updated", completed: !existing.completed }
  } else {
    await db.progress.create({
      data: { userId: user.id, lessonId, completed: true }
    })
    revalidatePath("/dashboard")
    return { success: "Lesson completed", completed: true }
  }
}

// 6. GET COURSE PROGRESS %
export async function getCourseProgress(courseId: string) {
  const user = await requireAuth()
  
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: { lessons: true }
  })

  if (!course || course.lessons.length === 0) return 0

  const completedLessons = await db.progress.count({
    where: {
      userId: user.id,
      completed: true,
      lesson: { courseId }
    }
  })

  return Math.round((completedLessons / course.lessons.length) * 100)
}

// 7. GET ALL COMPLETED LESSON IDS FOR A COURSE
export async function getCompletedLessons(courseId: string) {
  const user = await requireAuth()

  const progress = await db.progress.findMany({
    where: {
      userId: user.id,
      completed: true,
      lesson: { courseId }
    },
    select: { lessonId: true }
  })

  return progress.map(p => p.lessonId)
}