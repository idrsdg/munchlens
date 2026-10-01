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
  const { endpoint } = await req.json();

  if (!endpoint) {
    // Remove all subscriptions for this user
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
  } else {
    await db
      .delete(pushSubscriptions)
      .where(
        and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint))
      );
  }

  return NextResponse.json({ success: true });
}
