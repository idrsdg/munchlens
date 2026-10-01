import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateObject } from "ai";
import { gpt4oMini, RECIPE_SUGGESTION_SYSTEM_PROMPT } from "@/lib/openai";
import { checkRateLimit } from "@/lib/redis";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const FREE_LIMIT = 10;
const PRO_LIMIT = 100;

const RecipesSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      cookTime: z.number(),
      servings: z.number(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
      difficulty: z.enum(["kolay", "orta", "zor"]),
      ingredients: z.array(z.string()),
      missingIngredients: z.array(z.string()),
      steps: z.array(z.string()),
    })
  ),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
  }

  const userId = session.user.id;
  const [user] = await db.select({ isPro: users.isPro, dietType: users.dietType, allergies: users.allergies })
    .from(users).where(eq(users.id, userId));

  const limit = user?.isPro ? PRO_LIMIT : FREE_LIMIT;
  const rateLimit = await checkRateLimit(userId, "recipe_suggest", limit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Günlük tarif önerisi limitinize ulaştınız.", upgradeRequired: !user?.isPro },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { ingredients, maxCalories, count = 3 } = body;

  if (!ingredients?.length) {
    return NextResponse.json({ error: "Malzeme listesi gereklidir" }, { status: 400 });
  }

  const userPreferences = `
Kullanıcı tercihleri:
- Diyet tipi: ${user?.dietType || "normal"}
- Alerjiler: ${(user?.allergies as string[] || []).join(", ") || "yok"}
${maxCalories ? `- Maksimum kalori: ${maxCalories} kcal` : ""}
`;

  const { object } = await generateObject({
    model: gpt4oMini,
    schema: RecipesSchema,
    system: RECIPE_SUGGESTION_SYSTEM_PROMPT,
    prompt: `${userPreferences}
Elimdeki malzemeler: ${ingredients.join(", ")}

${count} adet tarif öner. Mümkün olduğunca elimdeki malzemeleri kullan.`,
  });

  return NextResponse.json(object);
}
