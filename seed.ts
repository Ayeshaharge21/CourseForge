import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing data
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.payment.deleteMany();

  console.log("Cleared old records.");

  // 2. Create Instructor 
  const instructor = await prisma.user.create({
    data: {
      name: 'Ayesha Harge',
      email: 'ayesha@test.com',
      password: 'password123', 
      role: 'INSTRUCTOR',
    }
  });

  console.log(`Created instructor: ${instructor.name}`);

  // 3. Create Students
  const studentPromises = Array.from({ length: 3 }).map((_, i) => 
    prisma.user.create({
      data: {
        name: `Student ${i + 1}`,
        email: `student${i + 1}@test.com`,
        password: 'password123',
        role: 'STUDENT',
      }
    })
  );

  const students = await Promise.all(studentPromises);
  console.log(`Successfully seeded ${students.length} students.`);
  console.log("Seeding process completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {

    await prisma.$disconnect();
  });
