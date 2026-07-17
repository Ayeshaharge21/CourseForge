import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"; 
import { prisma } from "@/lib/prisma"; 

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

        try {
          // यूज़र को डेटाबेस में खोजें
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            return null;
          }

          // पासवर्ड मैच लॉजिक (यदि आप bcrypt यूज़ कर रहे हैं)
          // const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          // if (!isPasswordValid) return null;

          return user;
        } catch (error) {
          console.error("Auth authorize error:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", 
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

// Next.js App Router के लिए GET और POST एक्सपोर्ट होना अनिवार्य है
export { handler as GET, handler as POST };
