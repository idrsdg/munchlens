const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID!;
const EDAMAM_API_KEY = process.env.EDAMAM_API_KEY!;
const BASE_URL = "https://api.edamam.com/api/food-database/v2";

export interface EdamamFood {
  foodId: string;
  label: string;
  image?: string;
  nutrients: {
    ENERC_KCAL: number; // kalori
    PROCNT: number;     // protein
    CHOCDF: number;     // karbonhidrat
    FAT: number;        // yağ
    FIBTG?: number;     // lif
  };
  category?: string;
}

export interface EdamamSearchResult {
  foods: EdamamFood[];
  totalHits: number;
}

export async function searchFood(query: string, locale = "tr-TR"): Promise<EdamamSearchResult> {
  const params = new URLSearchParams({
    app_id: EDAMAM_APP_ID,
    app_key: EDAMAM_API_KEY,
    ingr: query,
    "nutrition-type": "logging",
  });

  const res = await fetch(`${BASE_URL}/parser?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Edamam API hatası: ${res.status}`);
  }

  const data = await res.json();

  return {
    foods: (data.hints || []).slice(0, 10).map((hint: any) => ({
      foodId: hint.food.foodId,
      label: hint.food.label,
      image: hint.food.image,
      nutrients: hint.food.nutrients,
      category: hint.food.category,
    })),
    totalHits: data.parsed?.length || 0,
  };
}

export async function getFoodNutrients(foodId: string, quantity: number, unit = "g") {
  const res = await fetch(`${BASE_URL}/nutrients?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ingredients: [{ quantity, unit, foodId }],
    }),
  });

  if (!res.ok) throw new Error("Besin değerleri alınamadı");
  return res.json();
}
