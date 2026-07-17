import { db } from "@/lib/db" // या अगर आपकी फ़ाइल में prisma है तो: import { prisma as db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server" // या अपना कस्टम ऑथ इम्पोर्ट करें
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// हम इसके यूज़र इंटरफ़ेस (UI) फॉर्म्स को संभालने के लिए नीचे एक क्लाइंट कंपोनेंट का रेफरेंस लेंगे 
// या फिर आप डायरेक्ट सर्वर एक्शन्स (Server Actions) यूज़ कर सकते हैं।
import { CourseEditForm } from "./_components/course-edit-form" 

interface CoursePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CourseIdPage({ params }: CoursePageProps) {
  // Next.js 15+ के नियमों के मुताबिक params को await करना ज़रूरी है
  const { id } = await params
  
  const { userId } = await auth()
  if (!userId) {
    return redirect("/")
  }

  // सर्वर साइड पर सुरक्षित डेटाबेस क्वेरी
  const course = await db.course.findUnique({
    where: {
      id: id,
      instructorId: userId, // सुनिश्चित करें कि सिर्फ वही इंस्ट्रक्टर इसे देख पाए
    },
    include: {
      lessons: {
        orderBy: {
          position: "asc",
        },
      },
    },
  })

  if (!course) {
    return redirect("/instructor/courses")
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href="/instructor/courses"
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to courses
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Course setup</h1>
              <span className="text-sm text-slate-500">
                Customize your course details and modules
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* यहाँ आपका सारा फ़ॉर्म का स्टेट और UI लॉजिक जाएगा जो हम क्लाइंट कंपोनेंट में पास करेंगे */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your course</h2>
          </div>
          {/* क्लाइंट साइड इंटरैक्शन के लिए अलग फॉर्म कंपोनेंट */}
          <CourseEditForm initialData={course} courseId={course.id} />
        </div>
      </div>
    </div>
  )
}
