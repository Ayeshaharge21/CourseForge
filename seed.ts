import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.enrollment.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Instructor
  const instructor = await prisma.user.create({
    data: {
      name: 'Ayesha Harge',
      email: 'ayesha@test.com',
      role: 'INSTRUCTOR',
      image: 'https://i.pravatar.cc/150?u=ayesha'
    }
  })

  // 2. Create Students
  const students = await Promise.all(
    Array.from({ length: 8 }).map((_, i) =>
      prisma.user.create({
        data: {
          name: `Student ${i + 1}`,
          email: `student${i + 1}@test.com`,
          role: 'STUDENT',
          image: `https://i.pravatar.cc/150?u=student${i}`
        }
      })
    )
  )

  // 3. Create 5 Courses
  const courseTitles = [
    'Next.js 15 Full Course',
    'Prisma + PostgreSQL Mastery',
    'Tailwind CSS From Zero to Hero',
    'NextAuth Authentication',
    'Deploy to Vercel + Neon'
  ]

  const courses = await Promise.all(
    courseTitles.map((title) =>
      prisma.course.create({
        data: {
          title,
          description: `Learn ${title} with hands-on projects`,
          thumbnail: 'https://picsum.photos/seed/' + title + '/400/300',
          price: Math.floor(Math.random() * 5000) + 999,
          published: true,
          instructorId: instructor.id,
          lessons: {
            create: Array.from({ length: 6 }).map((_, i) => ({
              title: `Lesson ${i + 1}: Introduction`,
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              position: i + 1,
              published: true
            }))
          }
        }
      })
    )
  )

  // 4. Enroll students + fake progress
  for (const student of students) {
    const randomCourses = courses.sort(() => 0.5 - Math.random()).slice(0, 3)
    for (const course of randomCourses) {
      await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: course.id
        }
      })
      
      // Mark 2 random lessons as complete
      const lessons = await prisma.lesson.findMany({ where: { courseId: course.id } })
      for (const lesson of lessons.slice(0, 2)) {
        await prisma.progress.create({
          data: {
            userId: student.id,
            lessonId: lesson.id,
            completed: true
          }
        })
      }
    }
  }

  console.log(`✅ Seed complete! Created ${courses.length} courses, ${students.length + 1} users`)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())