# CourseForge Architecture

## 1. Tech Stack 

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 14 - App Router |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui - Nova Theme |
| **Database** | Prisma ORM + SQLite for dev, Postgres for prod |
| **Auth** | Custom JWT + Cookies. Upgrade path: NextAuth.js |
| **Validation** | Zod |
| **State** | Server Components + Server Actions. No client state lib needed yet |
| **Deployment** | Vercel |

## 2. Folder Structure
CourseForge/
├── app/
│   ├── actions/              # All DB mutations - Server Actions
│   │   ├── course-actions.ts
│   │   ├── lesson-actions.ts
│   │   └── enrollment-actions.ts
│   ├── lib/                  # Core utilities
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── auth.ts           # JWT, requireAuth(), requireRole()
│   │   ├── utils.ts          # cn(), formatters
│   │   └── validations.ts    # Zod schemas
│   ├── (auth)/               # Public routes
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx    # Student dashboard + progress
│   ├── courses/[id]/page.tsx # Course detail + enroll button
│   ├── lesson/[id]/page.tsx  # Lesson player + mark complete
│   ├── layout.tsx            # Root layout + Navbar + Theme
│   └── globals.css           # Tailwind + Nova theme vars
├── components/
│   ├── ui/                   # shadcn components
│   ├── course-card.tsx
│   ├── lesson-player.tsx
│   └── progress-bar.tsx
├── prisma/
│   └── schema.prisma         # DB models
├── docs/
│   └── architecture.md       # This file
├── .env.example              # Env template
├── next.config.mjs           # Next.js config
└── README.md


## 3. Data Model - Prisma
User 1--_ Enrollment --1 Course
Course 1-- Lesson
User 1--_ Progress *--1 Lesson

**Models:**
- `User`: id, email, name, password, role: STUDENT | INSTRUCTOR | ADMIN, createdAt
- `Course`: id, title, description, thumbnail, instructorId, createdAt
- `Lesson`: id, title, content, videoUrl, order, courseId
- `Enrollment`: @@id([userId, courseId]) - prevents duplicates
- `Progress`: @@id([userId, lessonId]), completed: Boolean

## 4. Environment & Config

**`.env`**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="openssl rand -base64 32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
next.config.mjs
- serverActions: enabled with 2mb body limit
- images.remotePatterns: Unsplash, CDN, avatar.vercel.sh
- typescript/eslint: fail build on errors

## 5. Auth Flow

1. signup() → Zod validate → bcrypt → db.user.create → setSessionCookie
2. login() → verify password → setSessionCookie
3. requireAuth() → reads JWT from cookie → returns user or redirects
4. requireRole("INSTRUCTOR") → role check for create/edit
5. logout() → delete cookie
Cookie flags: httpOnly, secure in prod, sameSite: lax, 7d expiry

## 6. Server Actions Pattern

"use server"
export async function enrollInCourse(courseId: string) {
  const user = await requireAuth()
  await db.enrollment.create({ data: { userId: user.id, courseId }})
  revalidatePath("/dashboard")
  revalidatePath(`/courses/${courseId}`)
}


Last updated: April 2026

### **What changed in this update:**
1.  **Added**: `.env`, `next.config.mjs`, deployment table
2.  **Clarified**: Server Actions pattern + revalidation
3.  **Added**: Security section + cookie flags
4.  **Added**: `@@id` for Enrollment/Progress to prevent duplicates

This doc now matches all the boilerplate files we just made.

Ready for the final piece: `prisma/schema.prisma`? Once that’s in we can run `npx prisma db push` and start building pages.
