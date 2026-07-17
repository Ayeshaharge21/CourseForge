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
  try {
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
    
    // Next.js 15+ के नियमानुसार cookies() को await करना ज़रूरी है
    const cookieStore = await cookies();
    
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    return { success: true };
  } catch (error) {
    console.error("Failed to create session:", error);
    return { error: "Session creation failed" };
  }
}

// 2. Get current user session from cookies
export async function auth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return { user: decoded };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

// 3. Clear cookie on logout
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}
