"use server";

import { prisma as db } from "@/lib/prisma"; // आपके प्रोजेक्ट के सही पाथ के अनुसार (यदि db नाम है तो: import { db } from "@/lib/db")
import { auth } from "@/lib/auth"; // सही पाथ इम्पोर्ट
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. GET ALL COURSES (इंस्ट्रक्टर के सभी कोर्सेस प्राप्त करने के लिए)
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

// 2. GET COURSE BY ID (किसी एक विशिष्ट कोर्स को खोजने के लिए)
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
            order: "asc" // आपके स्कीमा के अनुसार
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
