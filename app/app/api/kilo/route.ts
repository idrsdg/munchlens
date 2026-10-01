import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { weightLogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [logs, user] = await Promise.all([
    db.select().from(weightLogs).where(eq(weightLogs.userId, session.user.id)).orderBy(desc(weightLogs.date)).limit(90),
    db.select({ weightKg: users.weightKg, targetWeightKg: users.targetWeightKg, heightCm: users.heightCm })
      .from(users).where(eq(users.id, session.user.id)).then((r) => r[0]),
  ]);

  return NextResponse.json({ logs, user });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { weightKg, date, notes } = await req.json();
  if (!weightKg || !date) return NextResponse.json({ error: "Eksik veri" }, { status: 400 });

  // Aynı tarih için kayıt varsa güncelle
  const [existing] = await db.select().from(weightLogs)
    .where(eq(weightLogs.userId, session.user.id));

  await db.insert(weightLogs).values({
    userId: session.user.id,
    date,
    weightKg: Number(weightKg),
    notes: notes || null,
  });

  // users tablosundaki mevcut kiloya güncelle
  await db.update(users).set({ weightKg: Number(weightKg) }).where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
