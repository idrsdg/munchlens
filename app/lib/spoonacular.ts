const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY!;
const BASE_URL = "https://api.spoonacular.com";

export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  usedIngredients?: string[];
  missedIngredients?: string[];
  missedIngredientCount?: number;
}

export interface RecipeDetail extends Recipe {
  summary: string;
  instructions: string;
  extendedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  analyzedInstructions: Array<{
    steps: Array<{ number: number; step: string }>;
  }>;
  diets: string[];
  glutenFree: boolean;
  dairyFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
}

// Malzemeye göre tarif ara
export async function findRecipesByIngredients(
  ingredients: string[],
  number = 6
): Promise<Recipe[]> {
  const params = new URLSearchParams({
    apiKey: SPOONACULAR_KEY,
    ingredients: ingredients.join(","),
    number: number.toString(),
    ranking: "2",
    ignorePantry: "true",
  });

  const res = await fetch(`${BASE_URL}/recipes/findByIngredients?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Spoonacular hatası: ${res.status}`);
  return res.json();
}

// Tarif keşfet (filtreli)
export async function searchRecipes(params: {
  query?: string;
  diet?: string;
  maxCalories?: number;
  minCalories?: number;
  maxReadyTime?: number;
  type?: string;
  number?: number;
  offset?: number;
}): Promise<{ results: Recipe[]; totalResults: number }> {
  const searchParams = new URLSearchParams({
    apiKey: SPOONACULAR_KEY,
    number: (params.number ?? 12).toString(),
    offset: (params.offset ?? 0).toString(),
    addRecipeNutrition: "true",
    ...(params.query && { query: params.query }),
    ...(params.diet && { diet: params.diet }),
    ...(params.maxCalories && { maxCalories: params.maxCalories.toString() }),
    ...(params.minCalories && { minCalories: params.minCalories.toString() }),
    ...(params.maxReadyTime && { maxReadyTime: params.maxReadyTime.toString() }),
    ...(params.type && { type: params.type }),
  });

  const res = await fetch(`${BASE_URL}/recipes/complexSearch?${searchParams}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`Spoonacular hatası: ${res.status}`);
  return res.json();
}

// Tarif detayı
export async function getRecipeDetail(id: number): Promise<RecipeDetail> {
  const res = await fetch(
    `${BASE_URL}/recipes/${id}/information?apiKey=${SPOONACULAR_KEY}&includeNutrition=true`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error(`Tarif bulunamadı: ${id}`);
  return res.json();
}
