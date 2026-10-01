import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { savedRecipes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET /api/tarifler/kaydet — list saved recipes
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const recipes = await db
    .select()
    .from(savedRecipes)
    .where(eq(savedRecipes.userId, session.user.id))
    .orderBy(savedRecipes.savedAt);

  return NextResponse.json({ recipes });
}

// POST /api/tarifler/kaydet — save or unsave a recipe (toggle)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipeId, recipeTitle, recipeImage, calories, servings } = await req.json();
  if (!recipeId || !recipeTitle) return NextResponse.json({ error: "recipeId and recipeTitle required" }, { status: 400 });

  const existing = await db
    .select()
    .from(savedRecipes)
    .where(and(eq(savedRecipes.userId, session.user.id), eq(savedRecipes.recipeId, String(recipeId))))
    .then((r) => r[0]);

  if (existing) {
    await db.delete(savedRecipes).where(eq(savedRecipes.id, existing.id));
    return NextResponse.json({ saved: false });
  }

  await db.insert(savedRecipes).values({
    userId: session.user.id,
    recipeId: String(recipeId),
    recipeTitle,
    recipeImage,
    calories,
    servings,
  });

  return NextResponse.json({ saved: true });
}
