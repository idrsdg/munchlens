import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OnboardingClient from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/giris");

  const [user] = await db
    .select({ age: users.age })
    .from(users)
    .where(eq(users.id, session.user.id));

  // Onboarding already completed
  if (user?.age) redirect("/dashboard");

  return <OnboardingClient />;
}
