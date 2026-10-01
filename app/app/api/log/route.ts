import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { foodLogs, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

const CreateLogSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mealType: z.enum(["kahvalti", "ogle", "aksam", "ara_ogun"]),
  foodName: z.string().min(1).max(200),
  portionGrams: z.number().positive().optional(),
  portionDescription: z.string().optional(),
  calories: z.number().min(0),
  proteinG: z.number().min(0).default(0),
  carbG: z.number().min(0).default(0),
  fatG: z.number().min(0).default(0),
  fiberG: z.number().min(0).default(0),
  source: z.enum(["photo", "barcode", "search", "manual"]).default("manual"),
  imageUrl: z.string().url().optional(),
  aiConfidence: z.number().min(0).max(1).optional(),
});

// GET /api/log?date=2026-03-16
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) return NextResponse.json({ error: "date parametresi gerekli" }, { status: 400 });

  const logs = await db
    .select()
    .from(foodLogs)
    .where(and(eq(foodLogs.userId, session.user.id), eq(foodLogs.date, date)))
    .orderBy(desc(foodLogs.loggedAt));

  // Günlük toplam hesapla
  const totals = logs.reduce(
    (acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.proteinG || 0),
      carbs: acc.carbs + (log.carbG || 0),
      fat: acc.fat + (log.fatG || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return NextResponse.json({ logs, totals, date });
}

// POST /api/log
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = CreateLogSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [log] = await db
    .insert(foodLogs)
    .values({ ...parsed.data, userId: session.user.id })
    .returning();

  // Streak güncelle
  await updateStreak(session.user.id, parsed.data.date);

  return NextResponse.json(log, { status: 201 });
}

// DELETE /api/log/:id
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id gerekli" }, { status: 400 });

  await db.delete(foodLogs).where(
    and(eq(foodLogs.id, id), eq(foodLogs.userId, session.user.id))
  );

  return NextResponse.json({ success: true });
}

async function updateStreak(userId: string, date: string) {
  const [user] = await db
    .select({ currentStreak: users.currentStreak, lastLogDate: users.lastLogDate, longestStreak: users.longestStreak })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) return;

  const today = date;
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = 1;
  if (user.lastLogDate === yesterdayStr) {
    newStreak = (user.currentStreak || 0) + 1;
  } else if (user.lastLogDate === today) {
    return; // Bugün zaten loglandı
  }

  const longestStreak = Math.max(newStreak, user.longestStreak || 0);

  await db.update(users).set({
    currentStreak: newStreak,
    longestStreak,
    lastLogDate: today,
  }).where(eq(users.id, userId));
}
