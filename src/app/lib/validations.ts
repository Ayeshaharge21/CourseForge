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

// 3. Lesson Schemas
export const createLessonSchema = z.object({
  title: z.string().min(3, "Lesson title required"),
  content: z.string().min(10, "Content cannot be empty"),
  order: z.coerce.number().int().min(1, "Order must be at least 1"),
  courseId: z.string().cuid(),
})

// 4. Quiz Schemas
export const createQuizSchema = z.object({
  question: z.string().min(5, "Question too short"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "Need at least 2 options"),
  correctAnswer: z.number().int().min(0),
})

// Types for TypeScript
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreateCourseInput = z.infer<typeof createCourseSchema>
export type CreateLessonInput = z.infer<typeof createLessonSchema>