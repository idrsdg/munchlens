// Edge runtime uyumlu auth config (DB adapter YOK)
// middleware.ts bu dosyayı kullanır
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPublicPath =
        nextUrl.pathname.startsWith("/giris") ||
        nextUrl.pathname.startsWith("/api/auth") ||
        nextUrl.pathname.startsWith("/api/kayit") ||
        nextUrl.pathname.startsWith("/api/lemonsqueezy/webhook") ||
        nextUrl.pathname === "/";

      if (isPublicPath) return true;
      if (isLoggedIn) return true;
      return false;
    },
  },
  providers: [],
};
