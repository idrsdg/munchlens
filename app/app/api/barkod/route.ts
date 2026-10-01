import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { lookupBarcode } from "@/lib/openfoodfacts";
import { getCache, setCache } from "@/lib/redis";

// GET /api/barkod?code=8690526100568
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) return NextResponse.json({ error: "Barkod kodu gerekli" }, { status: 400 });

  const cacheKey = `barcode:${code}`;
  const cached = await getCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  const product = await lookupBarcode(code);

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
  }

  await setCache(cacheKey, product, 86400);
  return NextResponse.json(product);
}
