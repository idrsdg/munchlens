import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { mealPlans, users } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { openai as openaiClient } from "@/lib/openai";

const MEAL_LABELS: Record<string, string> = {
  kahvalti: "Kahvaltı",
  ogle: "Öğle Yemeği",
  aksam: "Akşam Yemeği",
  ara_ogun: "Ara Öğün",
};

const DAY_NAMES = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon
  const diff = day === 0 ? -6 : 1 - day; // adjust to Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().split("T")[0];
}

// GET /api/plan — fetch latest meal plan
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const weekStart = new URL(req.url).searchParams.get("week") || getWeekStartDate();

  const [plan] = await db
    .select()
    .from(mealPlans)
    .where(and(eq(mealPlans.userId, session.user.id), eq(mealPlans.weekStartDate, weekStart)))
    .orderBy(desc(mealPlans.createdAt))
    .limit(1);

  return NextResponse.json({ plan: plan || null, weekStart });
}

// POST /api/plan — generate new meal plan with AI
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  if (!user) return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 });

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "AI servisi şu an aktif değil" }, { status: 503 });
  }

  const weekStart = getWeekStartDate();
  const calorieGoal = user.dailyCalorieGoal || 2000;
  const dietType = user.dietType || "normal";
  const allergies = (user.allergies as string[]) || [];

  const prompt = `Sen Türk mutfağını çok iyi bilen bir beslenme uzmanısın. Aşağıdaki profile göre 7 günlük haftalık öğün planı oluştur.

Kullanıcı Profili:
- Günlük kalori hedefi: ${calorieGoal} kcal
- Diyet tipi: ${dietType}
- Alerjiler: ${allergies.length > 0 ? allergies.join(", ") : "yok"}
- Hedef: ${user.goalType === "ver" ? "kilo vermek" : user.goalType === "al" ? "kilo almak" : "kiloyu korumak"}

Kurallar:
- Her günde tam 4 öğün olmalı: kahvalti, ogle, aksam, ara_ogun
- Toplam günlük kalori ${calorieGoal} kcal'e yakın olmalı (±100 kcal)
- Türk mutfağından yemekler tercih et ama çeşitlilik sağla
- Gerçekçi, evde yapılabilir yemekler seç
- Her öğün için porsiyon açıklaması ekle (örn: "1 dilim", "200g", "1 kase")

Şu formatta JSON döndür (başka hiçbir metin ekleme):
{
  "days": [
    {
      "dayName": "Pazartesi",
      "meals": {
        "kahvalti": { "name": "Yemek adı", "portion": "Porsiyon", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "ogle": { "name": "Yemek adı", "portion": "Porsiyon", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "aksam": { "name": "Yemek adı", "portion": "Porsiyon", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "ara_ogun": { "name": "Yemek adı", "portion": "Porsiyon", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
      },
      "totalCalories": 0
    }
  ]
}
Günler sırası: Pazartesi, Salı, Çarşamba, Perşembe, Cuma, Cumartesi, Pazar`;

  const model = openaiClient("gpt-4o-mini");

  let planData: any;
  try {
    const { generateText } = await import("ai");
    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
    });

    planData = JSON.parse(text || "{}");
  } catch (err) {
    console.error("OpenAI plan error:", err);
    return NextResponse.json({ error: "Plan oluşturulurken hata oluştu" }, { status: 500 });
  }

  if (!planData?.days?.length) {
    return NextResponse.json({ error: "Geçersiz plan verisi" }, { status: 500 });
  }

  const avgCalories =
    planData.days.reduce((s: number, d: any) => s + (d.totalCalories || 0), 0) /
    planData.days.length;

  // Delete existing plan for this week, then insert new
  await db
    .delete(mealPlans)
    .where(and(eq(mealPlans.userId, session.user.id), eq(mealPlans.weekStartDate, weekStart)));

  const [newPlan] = await db
    .insert(mealPlans)
    .values({
      userId: session.user.id,
      weekStartDate: weekStart,
      planData,
      totalCaloriesAvg: avgCalories,
    })
    .returning();

  return NextResponse.json({ plan: newPlan }, { status: 201 });
}
