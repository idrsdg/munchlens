import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateObject } from "ai";
import { gpt4o, PHOTO_ANALYSIS_SYSTEM_PROMPT } from "@/lib/openai";
import { checkRateLimit } from "@/lib/redis";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const FREE_LIMIT = 5;   // ücretsiz: günde 5
const PRO_LIMIT = 50;   // pro: günde 50

const FoodSchema = z.object({
  foods: z.array(
    z.object({
      name: z.string(),
      nameEn: z.string().optional(),
      portionDescription: z.string(),
      portionGrams: z.number(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      fiber: z.number().optional().default(0),
      confidence: z.number().min(0).max(1),
    })
  ),
  totalCalories: z.number(),
  mealType: z.enum(["kahvalti", "ogle", "aksam", "ara_ogun"]).optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
  }

  const userId = session.user.id;

  // Kullanıcı pro mu kontrol et
  const [user] = await db.select({ isPro: users.isPro }).from(users).where(eq(users.id, userId));
  const limit = user?.isPro ? PRO_LIMIT : FREE_LIMIT;

  // Rate limit kontrolü
  const rateLimit = await checkRateLimit(userId, "photo_analysis", limit);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Günlük fotoğraf analizi limitinize ulaştınız.",
        remaining: 0,
        resetAt: rateLimit.resetAt,
        upgradeRequired: !user?.isPro,
      },
      { status: 429 }
    );
  }

  // Görsel al
  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const base64 = formData.get("base64") as string | null;

  let imageUrl: string;

  if (base64) {
    imageUrl = base64.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
  } else if (file) {
    const bytes = await file.arrayBuffer();
    const b64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type || "image/jpeg";
    imageUrl = `data:${mimeType};base64,${b64}`;
  } else {
    return NextResponse.json({ error: "Görsel bulunamadı" }, { status: 400 });
  }

  try {
    const { object } = await generateObject({
      model: gpt4o,
      schema: FoodSchema,
      system: PHOTO_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: imageUrl,
            },
            {
              type: "text",
              text: "Bu yemek fotoğrafını analiz et ve besin değerlerini döndür.",
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      ...object,
      remaining: rateLimit.remaining - 1,
    });
  } catch (error) {
    console.error("Fotoğraf analiz hatası:", error);
    return NextResponse.json(
      { error: "Analiz sırasında hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
