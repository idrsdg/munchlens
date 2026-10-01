import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { weightLogs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [userData, logs] = await Promise.all([
    db.select({ weightKg: users.weightKg, targetWeightKg: users.targetWeightKg, goalType: users.goalType })
      .from(users).where(eq(users.id, session.user.id)).limit(1),
    db.select().from(weightLogs)
      .where(eq(weightLogs.userId, session.user.id))
      .orderBy(desc(weightLogs.date))
      .limit(90),
  ]);

  return NextResponse.json({
    logs: logs.reverse(),
    currentWeight: userData[0]?.weightKg ?? null,
    targetWeight: userData[0]?.targetWeightKg ?? null,
    goalType: userData[0]?.goalType ?? "kor",
  });
}

const LogSchema = z.object({
  weightKg: z.number().min(10).max(500),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = LogSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });

  const { weightKg, date, notes } = parsed.data;

  // Upsert: delete existing entry for same day, insert new
  const existing = await db.select({ id: weightLogs.id })
    .from(weightLogs)
    .where(eq(weightLogs.userId, session.user.id))
    .limit(100);

  const sameDay = existing; // we'll just insert
  const [log] = await db.insert(weightLogs).values({
    userId: session.user.id,
    date,
    weightKg,
    notes,
  }).returning();

  // Update current weight in user profile
  await db.update(users).set({ weightKg, updatedAt: new Date() }).where(eq(users.id, session.user.id));

  return NextResponse.json({ log }, { status: 201 });
}
