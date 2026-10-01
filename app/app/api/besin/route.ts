import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { searchFood } from "@/lib/edamam";
import { getCache, setCache } from "@/lib/redis";

// GET /api/besin?q=tavuk&locale=tr
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "En az 2 karakter girin" }, { status: 400 });
  }

  // Cache kontrol
  const cacheKey = `food_search:${query.toLowerCase()}`;
  const cached = await getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  const results = await searchFood(query);
  await setCache(cacheKey, results, 3600);

  return NextResponse.json(results);
}
