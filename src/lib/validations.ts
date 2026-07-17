import { z } from "zod"

// 1. Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// 2. Course Schemas
export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  instructor: z.string().min(2, "Instructor name required"),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

// 3. Lesson Schemas (lesson-actions.ts के लिए आवश्यक)
export const createLessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  content: z.string().min(5, "Content description or URL is required"),
  courseId: z.string().min(1, "Course ID is required"),
})
