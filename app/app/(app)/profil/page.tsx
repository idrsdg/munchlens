import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import ProfilClient from "./profil-client";

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();
  const userId = session!.user!.id!;
  const sp = await searchParams;

  const [user, sub] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)).then((r) => r[0]),
    db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).then((r) => r[0]),
  ]);

  return (
    <ProfilClient
      user={user}
      sub={sub}
      session={{ user: session?.user }}
      success={sp.success}
      canceled={sp.canceled}
    />
  );
}
