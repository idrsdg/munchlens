import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pushSubscriptions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
  }

  const userId = session.user.id;
  const { endpoint, keys } = await req.json();

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Geçersiz abonelik verisi" }, { status: 400 });
  }

  // Upsert: same endpoint → update, new → insert
  const [existing] = await db
    .select({ id: pushSubscriptions.id })
    .from(pushSubscriptions)
    .where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));

  if (!existing) {
    await db.insert(pushSubscriptions).values({
      userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    });
  }

  return NextResponse.json({ success: true });
}
