import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  age: z.number().int().min(1).max(120).optional(),
  heightCm: z.number().min(50).max(300).optional(),
  weightKg: z.number().min(10).max(500).optional(),
  targetWeightKg: z.number().min(10).max(500).optional(),
  goalType: z.enum(["ver", "kor", "al"]).optional(),
  activityLevel: z.enum(["hareketsiz", "az_aktif", "orta", "cok_aktif"]).optional(),
  dailyCalorieGoal: z.number().int().min(500).max(10000).optional(),
  proteinGoalG: z.number().int().min(0).max(500).optional(),
  carbGoalG: z.number().int().min(0).max(1000).optional(),
  fatGoalG: z.number().int().min(0).max(500).optional(),
  dietType: z.enum(["normal", "vegan", "vejetaryen", "keto", "paleo", "glutensiz", "helal"]).optional(),
  language: z.string().optional(),
  theme: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = UpdateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const updates = Object.fromEntries(
    Object.entries(parsed.data).filter(([, v]) => v !== undefined)
  );

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Güncellenecek alan yok" }, { status: 400 });
  }

  await db
    .update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
