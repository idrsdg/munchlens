const USDA_API_KEY = process.env.USDA_API_KEY!;
const BASE_URL = "https://api.nal.usda.gov/fdc/v1";

// Türkçe → İngilizce yemek adı çevirileri
const TR_TO_EN: Record<string, string> = {
  tavuk: "chicken", "tavuk göğsü": "chicken breast", "tavuk but": "chicken thigh",
  "tavuk kanadı": "chicken wings", "hindi": "turkey",
  "kıyma": "ground beef", "dana eti": "beef", "kuzu": "lamb", "domuz": "pork",
  "somon": "salmon", "ton balığı": "tuna", "balık": "fish", "levrek": "sea bass",
  "çipura": "sea bream", "karides": "shrimp",
  yumurta: "egg", süt: "milk", yoğurt: "yogurt", peynir: "cheese",
  "beyaz peynir": "feta cheese", kaşar: "cheddar cheese", "tereyağı": "butter",
  ekmek: "bread", "tam buğday ekmeği": "whole wheat bread", simit: "bagel",
  pirinç: "rice", bulgur: "bulgur wheat", makarna: "pasta", erişte: "noodles",
  "yulaf ezmesi": "oatmeal", yulaf: "oats", un: "flour", nişasta: "starch",
  mercimek: "lentil", nohut: "chickpea", fasulye: "beans", bezelye: "peas",
  domates: "tomato", salatalık: "cucumber", biber: "pepper", patlıcan: "eggplant",
  kabak: "zucchini", ıspanak: "spinach", marul: "lettuce", havuç: "carrot",
  soğan: "onion", sarımsak: "garlic", patates: "potato", mantar: "mushroom",
  brokoli: "broccoli", karnabahar: "cauliflower", lahana: "cabbage",
  elma: "apple", muz: "banana", portakal: "orange", limon: "lemon",
  üzüm: "grapes", çilek: "strawberry", karpuz: "watermelon", kavun: "melon",
  armut: "pear", şeftali: "peach", kiraz: "cherry", erik: "plum",
  "zeytinyağı": "olive oil", "ayçiçek yağı": "sunflower oil", zeytin: "olive",
  şeker: "sugar", bal: "honey", reçel: "jam", nutella: "chocolate spread",
  kahve: "coffee", çay: "tea", "portakal suyu": "orange juice",
  badem: "almond", ceviz: "walnut", fındık: "hazelnut", antep: "pistachio",
  çikolata: "chocolate", bisküvi: "cookies", kek: "cake", pasta: "pastry",
  pilav: "rice pilaf", "mercimek çorbası": "lentil soup", çorba: "soup",
  salça: "tomato paste", ketçap: "ketchup", mayonez: "mayonnaise",
};

function translateQuery(query: string): string {
  const lower = query.toLowerCase().trim();
  return TR_TO_EN[lower] || query;
}

// Edamam ile aynı interface — YemekAra componenti değişmeden çalışır
export interface FoodItem {
  foodId: string;
  label: string;
  image?: string;
  nutrients: {
    ENERC_KCAL: number;
    PROCNT: number;
    CHOCDF: number;
    FAT: number;
    FIBTG?: number;
  };
  category?: string;
}

export interface FoodSearchResult {
  foods: FoodItem[];
  totalHits: number;
}

function getNutrient(nutrients: any[], id: number): number {
  const n = nutrients.find((n: any) => n.nutrientId === id);
  return n ? Math.round((n.value || 0) * 10) / 10 : 0;
}

export async function searchFood(query: string): Promise<FoodSearchResult> {
  if (!USDA_API_KEY) throw new Error("USDA_API_KEY eksik");

  const params = new URLSearchParams({
    query,
    api_key: USDA_API_KEY,
    pageSize: "15",
    dataType: "Foundation,SR Legacy,Branded",
  });

  const res = await fetch(`${BASE_URL}/foods/search?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`USDA API hatası: ${res.status}`);

  const data = await res.json();

  const foods: FoodItem[] = (data.foods || [])
    .filter((f: any) => {
      // Sadece besin değeri olan sonuçları al
      const kcal = getNutrient(f.foodNutrients || [], 1008);
      return kcal > 0;
    })
    .slice(0, 10)
    .map((food: any) => ({
      foodId: String(food.fdcId),
      label: food.description,
      nutrients: {
        ENERC_KCAL: getNutrient(food.foodNutrients || [], 1008), // Kalori
        PROCNT: getNutrient(food.foodNutrients || [], 1003),      // Protein
        CHOCDF: getNutrient(food.foodNutrients || [], 1005),      // Karbonhidrat
        FAT: getNutrient(food.foodNutrients || [], 1004),         // Yağ
        FIBTG: getNutrient(food.foodNutrients || [], 1079),       // Lif
      },
      category: food.foodCategory || food.brandOwner || undefined,
    }));

  return { foods, totalHits: data.totalHits || 0 };
}
