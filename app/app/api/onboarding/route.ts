import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const OnboardingSchema = z.object({
  gender: z.enum(["male", "female"]),
  age: z.number().int().min(10).max(120),
  heightCm: z.number().min(50).max(300),
  weightKg: z.number().min(10).max(500),
  targetWeightKg: z.number().min(10).max(500),
  goalType: z.enum(["ver", "kor", "al"]),
  activityLevel: z.enum(["hareketsiz", "az_aktif", "orta", "cok_aktif"]),
  dietType: z.enum(["normal", "vegan", "vejetaryen", "keto", "paleo", "glutensiz", "helal"]),
  allergies: z.array(z.string()).default([]),
  dailyCalorieGoal: z.number().int().min(500).max(10000),
  proteinGoalG: z.number().int().min(0).max(500),
  carbGoalG: z.number().int().min(0).max(1000),
  fatGoalG: z.number().int().min(0).max(500),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = OnboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;

  await db
    .update(users)
    .set({
      gender: d.gender,
      age: d.age,
      heightCm: d.heightCm,
      weightKg: d.weightKg,
      targetWeightKg: d.targetWeightKg,
      goalType: d.goalType,
      activityLevel: d.activityLevel,
      dietType: d.dietType,
      allergies: d.allergies,
      dailyCalorieGoal: d.dailyCalorieGoal,
      proteinGoalG: d.proteinGoalG,
      carbGoalG: d.carbGoalG,
      fatGoalG: d.fatGoalG,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id));

  return NextResponse.json({ success: true });
}
