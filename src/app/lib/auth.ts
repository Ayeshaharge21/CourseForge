import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "courseforge_token";

interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: "student" | "instructor" | "admin";
}

// 1. Create token and set cookie on login/signup
export async function createSession(user: UserPayload) {
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
  
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// 2. Get current user from cookie
export async function getSession(): Promise<UserPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    return payload;
  } catch (error) {
    return null;
  }
}

// 3. Delete cookie on logout
export async function logout() {
  cookies().delete(COOKIE_NAME);
  redirect("/login");
}

// 4. Protect routes - use in Server Components / Server Actions
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
}

// 5. Check if user is instructor/admin
export async function requireRole(role: "instructor" | "admin") {
  const session = await requireAuth();
  if (session.role !== role && session.role !== "admin") {
    redirect("/unauthorized");
  }
  return session;
}