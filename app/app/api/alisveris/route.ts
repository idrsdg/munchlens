import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { shoppingLists, mealPlans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const ItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().default("Diğer"),
  checked: z.boolean().default(false),
  quantity: z.string().optional(),
});

// GET — fetch active shopping list
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [list] = await db
    .select()
    .from(shoppingLists)
    .where(eq(shoppingLists.userId, session.user.id))
    .orderBy(desc(shoppingLists.createdAt))
    .limit(1);

  return NextResponse.json({ list: list ?? null });
}

// POST — create or update shopping list
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.action === "generate") {
    // Generate from latest meal plan
    const [plan] = await db
      .select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, session.user.id))
      .orderBy(desc(mealPlans.createdAt))
      .limit(1);

    if (!plan) return NextResponse.json({ error: "Önce haftalık plan oluşturun" }, { status: 400 });

    const planData = plan.planData as any;
    const itemMap = new Map<string, { category: string; count: number }>();

    for (const day of planData.days ?? []) {
      for (const meal of Object.values(day.meals ?? {})) {
        const m = meal as any;
        if (!m?.name) continue;
        const key = m.name.toLowerCase().trim();
        if (itemMap.has(key)) {
          itemMap.get(key)!.count++;
        } else {
          itemMap.set(key, {
            category: categorizeFood(m.name),
            count: 1,
          });
        }
      }
    }

    const items = Array.from(itemMap.entries()).map(([name, { category, count }]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      category,
      checked: false,
      quantity: count > 1 ? `${count}x` : undefined,
    }));

    // Sort by category
    items.sort((a, b) => a.category.localeCompare(b.category, "tr"));

    const [list] = await db
      .insert(shoppingLists)
      .values({
        userId: session.user.id,
        mealPlanId: plan.id,
        title: `${plan.weekStartDate} Haftası Listesi`,
        items,
      })
      .returning();

    return NextResponse.json({ list }, { status: 201 });
  }

  if (body.action === "update_items") {
    const { listId, items } = body;
    if (!listId) return NextResponse.json({ error: "listId gerekli" }, { status: 400 });

    const [list] = await db
      .update(shoppingLists)
      .set({ items, updatedAt: new Date() })
      .where(eq(shoppingLists.id, listId))
      .returning();

    return NextResponse.json({ list });
  }

  if (body.action === "add_item") {
    const { listId, item } = body;
    const parsed = ItemSchema.safeParse(item);
    if (!parsed.success) return NextResponse.json({ error: "Geçersiz item" }, { status: 400 });

    const [existing] = await db
      .select()
      .from(shoppingLists)
      .where(eq(shoppingLists.id, listId))
      .limit(1);

    if (!existing) return NextResponse.json({ error: "Liste bulunamadı" }, { status: 404 });

    const updatedItems = [...(existing.items as any[]), parsed.data];

    const [list] = await db
      .update(shoppingLists)
      .set({ items: updatedItems, updatedAt: new Date() })
      .where(eq(shoppingLists.id, listId))
      .returning();

    return NextResponse.json({ list });
  }

  return NextResponse.json({ error: "Geçersiz action" }, { status: 400 });
}

// Simple food categorizer
function categorizeFood(name: string): string {
  const lower = name.toLowerCase();
  if (/tavuk|et|kıyma|somon|balık|ton|hindi|biftek|sucuk|sosis/.test(lower)) return "Et & Balık";
  if (/süt|yoğurt|peynir|yumurta|tereyağ|kefir|labne/.test(lower)) return "Süt Ürünleri";
  if (/ekmek|pilav|makarna|bulgur|yulaf|tahıl|un|pirinç|mısır/.test(lower)) return "Tahıl & Ekmek";
  if (/elma|muz|portakal|üzüm|çilek|meyve|armut|kivi|domates/.test(lower)) return "Meyve";
  if (/salatalık|biber|patlıcan|kabak|ıspanak|marul|havuç|soğan|sarımsak|brokoli/.test(lower)) return "Sebze";
  if (/fasulye|mercimek|nohut|bezelye|baklagil/.test(lower)) return "Baklagil";
  if (/zeytinyağ|yağ|sirke|sos|baharat|tuz|şeker|bal/.test(lower)) return "Sos & Baharat";
  if (/çay|kahve|meyve suyu|su|içecek/.test(lower)) return "İçecek";
  if (/ceviz|badem|fındık|kuru üzüm|kuruyemiş/.test(lower)) return "Kuruyemiş";
  return "Diğer";
}
