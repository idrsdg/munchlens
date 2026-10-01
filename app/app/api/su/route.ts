import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { waterLogs } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

// GET /api/su?date=YYYY-MM-DD
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const date = new URL(req.url).searchParams.get("date");
  if (!date) return NextResponse.json({ error: "date gerekli" }, { status: 400 });

  const logs = await db
    .select()
    .from(waterLogs)
    .where(and(eq(waterLogs.userId, session.user.id), eq(waterLogs.date, date)))
    .orderBy(desc(waterLogs.loggedAt));

  const totalMl = logs.reduce((s, l) => s + (l.amountMl || 0), 0);
  return NextResponse.json({ logs, totalMl, date });
}

// POST /api/su — { date, amountMl }
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const amountMl = Number(body.amountMl);
  const date = String(body.date || "");

  if (!date || isNaN(amountMl) || amountMl <= 0) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  const [log] = await db
    .insert(waterLogs)
    .values({ userId: session.user.id, date, amountMl })
    .returning();

  return NextResponse.json(log, { status: 201 });
}

// DELETE /api/su?id=uuid
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  await db.delete(waterLogs).where(
    and(eq(waterLogs.id, id), eq(waterLogs.userId, session.user.id))
  );

  return NextResponse.json({ success: true });
}
