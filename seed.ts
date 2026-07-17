import { prisma } from "@/lib/prisma"; // ग्लोबल प्रिज्मा क्लाइंट का उपयोग करें

async function main() {
  console.log("Starting database seeding...");

  // 1. Clean existing data (डेटाबेस को साफ करना)
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.payment.deleteMany();

  console.log("Cleared old records.");

  // 2. Create Instructor (इंस्ट्रक्टर बनाना)
  const instructor = await prisma.user.create({
    data: {
      name: 'Ayesha Harge',
      email: 'ayesha@test.com',
      password: 'password123', // ध्यान दें: प्रोडक्शन में इसे bcrypt से हैश करना चाहिए
      role: 'INSTRUCTOR',
    }
  });

  console.log(`Created instructor: ${instructor.name}`);

  // 3. Create Students (स्टूडेंट्स बनाना)
  const studentPromises = Array.from({ length: 3 }).map((_, i) => 
    prisma.user.create({
      data: {
        name: `Student ${i + 1}`,
        email: `student${i + 1}@test.com`,
        password: 'password123',
        role: 'STUDENT', // एनम का सही कैपिटल रूप
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
    // प्रिज्मा कनेक्शन को सुरक्षित रूप से बंद करना
    await prisma.$disconnect();
  });
