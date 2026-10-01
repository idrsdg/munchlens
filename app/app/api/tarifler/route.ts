import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchRecipes, findRecipesByIngredients } from "@/lib/spoonacular";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const ingredients = searchParams.get("ingredients");
  const query = searchParams.get("q") ?? undefined;
  const type = searchParams.get("type") ?? undefined;
  const maxTime = searchParams.get("maxTime");

  try {
    if (ingredients) {
      const list = ingredients.split(",").map((s) => s.trim()).filter(Boolean);
      const results = await findRecipesByIngredients(list, 12);
      return NextResponse.json({ results });
    }

    const data = await searchRecipes({
      query,
      type,
      maxReadyTime: maxTime ? parseInt(maxTime) : undefined,
      number: 12,
    });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ results: [] });
  }
}
