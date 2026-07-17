import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // आपका ग्लोबल प्रिज्मा क्लाइंट

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // यहाँ अपना यूज़र वेरिफिकेशन लॉजिक लिखें (उदा. bcrypt.compare)
        // सुरक्षा के लिए अभी के लिए यह null रिटर्न कर रहा है।
        // वेरिफिकेशन सफल होने पर यूज़र ऑब्जेक्ट रिटर्न करें: return user;
        return null; 
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in", // आपका कस्टम साइन-इन पेज पाथ
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub as string;
      }
      return session;
    }
  }
});

// Next.js App Router के लिए GET और POST दोनों हँडलर्स को एक्सपोर्ट करना ज़रूरी है
export { handler as GET, handler as POST };
