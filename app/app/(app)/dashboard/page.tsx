import { auth } from "@/auth";
import { db } from "@/lib/db";
import { foodLogs, users, waterLogs, mealPlans } from "@/lib/db/schema";
import { eq, and, desc, lt } from "drizzle-orm";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date.toISOString().split("T")[0];
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const today = getTodayStr();
  const weekStart = getMonday();

  let user = null, logs: any[] = [], waters: any[] = [], todayPlan: any = null, recentFoods: any[] = [];
  try {
    [user, logs, waters] = await Promise.all([
      db.select().from(users).where(eq(users.id, userId)).then((r) => r[0]),
      db.select().from(foodLogs).where(and(eq(foodLogs.userId, userId), eq(foodLogs.date, today))),
      db.select().from(waterLogs).where(and(eq(waterLogs.userId, userId), eq(waterLogs.date, today))),
    ]);

    // Bugünkü planı çek
    const plan = await db
      .select()
      .from(mealPlans)
      .where(and(eq(mealPlans.userId, userId), eq(mealPlans.weekStartDate, weekStart)))
      .orderBy(desc(mealPlans.createdAt))
      .limit(1)
      .then((r) => r[0]);

    if (plan?.planData) {
      const todayDayIndex = new Date().getDay();
      const dayIdx = todayDayIndex === 0 ? 6 : todayDayIndex - 1;
      const days = (plan.planData as any).days;
      if (days?.[dayIdx]) todayPlan = days[dayIdx];
    }

    // Son yenenler (dün ve önceki günlerden, benzersiz, max 6)
    const recentRaw = await db
      .select({
        foodName: foodLogs.foodName,
        calories: foodLogs.calories,
        proteinG: foodLogs.proteinG,
        carbG: foodLogs.carbG,
        fatG: foodLogs.fatG,
        portionDescription: foodLogs.portionDescription,
      })
      .from(foodLogs)
      .where(and(eq(foodLogs.userId, userId), lt(foodLogs.date, today)))
      .orderBy(desc(foodLogs.loggedAt))
      .limit(30);

    // Deduplicate by foodName, keep first occurrence
    const seen = new Set<string>();
    recentFoods = recentRaw.filter((f) => {
      if (seen.has(f.foodName)) return false;
      seen.add(f.foodName);
      return true;
    }).slice(0, 6);
  } catch {
    // DB bağlantısı yoksa boş veri ile devam et
  }

  // Onboarding tamamlanmamışsa yönlendir
  if (!user?.dailyCalorieGoal) {
    const { redirect } = await import("next/navigation");
    redirect("/onboarding");
  }

  const totalCalories = logs.reduce((s, l) => s + (l.calories || 0), 0);
  const totalProtein = logs.reduce((s, l) => s + (l.proteinG || 0), 0);
  const totalCarbs = logs.reduce((s, l) => s + (l.carbG || 0), 0);
  const totalFat = logs.reduce((s, l) => s + (l.fatG || 0), 0);
  const totalWaterMl = waters.reduce((s, w) => s + (w.amountMl || 0), 0);

  return (
    <DashboardClient
      user={user}
      logs={logs}
      totals={{ calories: totalCalories, protein: totalProtein, carbs: totalCarbs, fat: totalFat }}
      totalWaterMl={totalWaterMl}
      today={today}
      todayPlan={todayPlan}
      recentFoods={recentFoods}
    />
  );
}
