import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { foodLogs, users } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const period = Math.min(90, Math.max(1, parseInt(new URL(req.url).searchParams.get("period") || "7")));
  const userId = session.user.id;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - period + 1);
  const startStr = startDate.toISOString().split("T")[0];

  const [logs, userRow] = await Promise.all([
    db.select().from(foodLogs).where(and(eq(foodLogs.userId, userId), gte(foodLogs.date, startStr))),
    db.select({
      dailyCalorieGoal: users.dailyCalorieGoal,
      proteinGoalG: users.proteinGoalG,
      carbGoalG: users.carbGoalG,
      fatGoalG: users.fatGoalG,
      currentStreak: users.currentStreak,
    }).from(users).where(eq(users.id, userId)).then((r) => r[0]),
  ]);

  // Build daily summaries (fill all days in range, even empty ones)
  const dailyMap = new Map<string, { calories: number; protein: number; carbs: number; fat: number }>();
  for (let i = 0; i < period; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dailyMap.set(d.toISOString().split("T")[0], { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }
  for (const log of logs) {
    const entry = dailyMap.get(log.date);
    if (entry) {
      entry.calories += log.calories || 0;
      entry.protein += log.proteinG || 0;
      entry.carbs += log.carbG || 0;
      entry.fat += log.fatG || 0;
    }
  }

  const dailySummaries = Array.from(dailyMap.entries())
    .map(([date, data]) => ({ date, calories: Math.round(data.calories), protein: Math.round(data.protein), carbs: Math.round(data.carbs), fat: Math.round(data.fat) }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const loggedSummaries = dailySummaries.filter((d) => d.calories > 0);
  const loggedDays = loggedSummaries.length;

  const averages = loggedDays > 0 ? {
    calories: Math.round(loggedSummaries.reduce((s, d) => s + d.calories, 0) / loggedDays),
    protein:  Math.round(loggedSummaries.reduce((s, d) => s + d.protein,  0) / loggedDays),
    carbs:    Math.round(loggedSummaries.reduce((s, d) => s + d.carbs,    0) / loggedDays),
    fat:      Math.round(loggedSummaries.reduce((s, d) => s + d.fat,      0) / loggedDays),
  } : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Top foods (by frequency)
  const foodCount = new Map<string, number>();
  for (const log of logs) foodCount.set(log.foodName, (foodCount.get(log.foodName) || 0) + 1);
  const topFoods = Array.from(foodCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  // Meal distribution (by total calories per meal type)
  const mealDist: Record<string, number> = {};
  for (const log of logs) {
    mealDist[log.mealType] = (mealDist[log.mealType] || 0) + (log.calories || 0);
  }

  return NextResponse.json({
    dailySummaries,
    averages,
    topFoods,
    mealDist,
    loggedDays,
    streak: userRow?.currentStreak || 0,
    goals: {
      dailyCalorieGoal: userRow?.dailyCalorieGoal ?? null,
      proteinGoalG:     userRow?.proteinGoalG ?? null,
      carbGoalG:        userRow?.carbGoalG ?? null,
      fatGoalG:         userRow?.fatGoalG ?? null,
    },
  });
}
