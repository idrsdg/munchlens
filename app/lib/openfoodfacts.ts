const OFF_BASE = "https://world.openfoodfacts.org/api/v2";

export interface BarcodeProduct {
  barcode: string;
  name: string;
  brand?: string;
  image?: string;
  servingSize?: string;
  nutrients: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  ingredients?: string;
}

export async function lookupBarcode(barcode: string): Promise<BarcodeProduct | null> {
  try {
    const res = await fetch(`${OFF_BASE}/product/${barcode}?fields=product_name,brands,image_url,serving_size,nutriments,ingredients_text`, {
      next: { revalidate: 86400 }, // 24 saat cache
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;

    const p = data.product;
    const n = p.nutriments || {};

    return {
      barcode,
      name: p.product_name || "Bilinmeyen Ürün",
      brand: p.brands,
      image: p.image_url,
      servingSize: p.serving_size,
      nutrients: {
        calories: n["energy-kcal_100g"] || n["energy-kcal"] || 0,
        protein: n.proteins_100g || 0,
        carbs: n.carbohydrates_100g || 0,
        fat: n.fat_100g || 0,
        fiber: n.fiber_100g,
        sugar: n.sugars_100g,
        sodium: n.sodium_100g,
      },
      ingredients: p.ingredients_text,
    };
  } catch {
    return null;
  }
}
