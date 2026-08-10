import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Faqat Google — boshqa login usuli yo'q, ro'yxatdan o'tish alohida emas.
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    // Google'dan kelgan ID tokenni saqlab qolamiz — buni backend'ga yuboramiz
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.googleIdToken = account.id_token;
      }

      // Birinchi marta login qilinganda backend'ga so'rov yuboramiz
      if (account && token.googleIdToken) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: token.googleIdToken }),
          });

          if (res.ok) {
            const data = await res.json();
            token.backendToken = data.token; // bizning Fastify JWT
            token.userId = data.user.id;
          }
        } catch (err) {
          console.error("Backend auth xatosi:", err);
        }
      }

      return token;
    },

    // Session ichiga backend token va userId'ni qo'shamiz —
    // frontend komponentlarida shu orqali backend'ga so'rov yuboramiz
    async session({ session, token }) {
      session.backendToken = token.backendToken as string;
      session.userId = token.userId as string;
      return session;
    },
  },

  pages: {
    signIn: "/login", // o'zimiz yozadigan login sahifasi
  },
});