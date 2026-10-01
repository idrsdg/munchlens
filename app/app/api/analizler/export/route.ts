import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { foodLogs } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
  }

  const userId = session.user.id;
  const since = new Date();
  since.setDate(since.getDate() - 90);
  const sinceDate = since.toISOString().slice(0, 10);

  const logs = await db
    .select()
    .from(foodLogs)
    .where(and(eq(foodLogs.userId, userId), gte(foodLogs.date, sinceDate)))
    .orderBy(foodLogs.date, foodLogs.loggedAt);

  const MEAL_LABELS: Record<string, string> = {
    kahvalti: "Kahvaltı",
    ogle: "Öğle",
    aksam: "Akşam",
    ara_ogun: "Ara Öğün",
  };

  const header = "Tarih,Öğün,Besin,Kalori,Protein (g),Karbonhidrat (g),Yağ (g)\n";
  const rows = logs
    .map((log) =>
      [
        log.date,
        MEAL_LABELS[log.mealType] || log.mealType,
        `"${log.foodName.replace(/"/g, '""')}"`,
        Math.round(log.calories),
        Math.round(log.proteinG ?? 0),
        Math.round(log.carbG ?? 0),
        Math.round(log.fatG ?? 0),
      ].join(",")
    )
    .join("\n");

  const csv = header + rows;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="munchlens-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
