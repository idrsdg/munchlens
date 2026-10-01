import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import BottomNav from "@/components/bottom-nav";
import SideNav from "@/components/side-nav";
import LanguageSwitcher from "@/components/language-switcher";
import ThemeToggle from "@/components/theme-toggle";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const [user] = await db
    .select({ age: users.age, isPro: users.isPro })
    .from(users)
    .where(eq(users.id, session.user.id));

  if (!user?.age) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <SideNav isPro={user?.isPro ?? false} />

      {/* Sticky top bar — language switcher + theme toggle */}
      <header className="md:ml-56 sticky top-0 z-20 h-12 bg-background/80 backdrop-blur-sm border-b border-border flex items-center justify-end px-4 gap-1">
        <LanguageSwitcher compact />
        <ThemeToggle />
      </header>

      {/* Content — shifts right on desktop to clear the sidebar */}
      <main className="md:ml-56 pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
