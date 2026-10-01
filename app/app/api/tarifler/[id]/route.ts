import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getRecipeDetail } from "@/lib/spoonacular";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const recipeId = parseInt(id);

  if (isNaN(recipeId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const detail = await getRecipeDetail(recipeId);
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Tarif bulunamadı" }, { status: 404 });
  }
}
