import { db } from "../../../../../../../lib/db"; 
import { auth } from "../../../../../../../lib/auth"; 
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CourseIdPage({ params }: CoursePageProps) {
  const { id } = await params;
  
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  
  const course = await db.course.findUnique({
    where: {
      id: id,
      instructorId: userId,
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/instructor/courses");
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <h2 className="text-xl">Customize your course</h2>
          </div>
          <div className="mt-4 p-4 border rounded-lg bg-white shadow-sm">
            <p className="font-medium text-lg">{course.title}</p>
            <p className="text-sm text-slate-500 mt-1">{course.description}</p>
            <p className="text-sm font-semibold mt-4 text-blue-600">
              {course.price ? `$${course.price}` : "Free Course"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
