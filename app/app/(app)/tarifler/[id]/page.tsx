"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock, Flame, Heart, Plus, ArrowLeft, Loader2,
  Users, Wheat, Droplets, ChefHat
} from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/context";

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  diets: string[];
  extendedIngredients: Array<{ id: number; original: string }>;
  analyzedInstructions: Array<{ steps: Array<{ number: number; step: string }> }>;
  nutrition?: { nutrients: Array<{ name: string; amount: number; unit: string }> };
  vegan?: boolean;
  vegetarian?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
}

export default function TarifDetayPage() {
  const t = useT();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [logging, setLogging] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState("ogle");

  const MEAL_OPTIONS = [
    { value: "kahvalti", label: t.dashboard.breakfast },
    { value: "ogle", label: t.dashboard.lunch },
    { value: "aksam", label: t.dashboard.dinner },
    { value: "ara_ogun", label: t.dashboard.snack },
  ];

  useEffect(() => {
    fetch(`/api/tarifler/${id}`)
      .then((r) => r.json())
      .then((d) => { setRecipe(d); setLoading(false); })
      .catch(() => { toast.error(t.recipes.failedLoad); setLoading(false); });
  }, [id]);

  async function handleSave() {
    if (!recipe) return;
    try {
      await fetch("/api/tarifler/kaydet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipeId: String(recipe.id),
          recipeTitle: recipe.title,
          recipeImage: recipe.image,
          calories: recipe.nutrition?.nutrients.find((n) => n.name === "Calories")?.amount,
          servings: recipe.servings,
        }),
      });
      setSaved(true);
      toast.success(t.recipes.savedOk);
    } catch {
      toast.error(t.recipes.saveFailed);
    }
  }

  async function handleLog() {
    if (!recipe) return;
    const cal = recipe.nutrition?.nutrients.find((n) => n.name === "Calories");
    const prot = recipe.nutrition?.nutrients.find((n) => n.name === "Protein");
    const carb = recipe.nutrition?.nutrients.find((n) => n.name === "Carbohydrates");
    const fat = recipe.nutrition?.nutrients.find((n) => n.name === "Fat");

    setLogging(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          mealType: selectedMeal,
          foodName: recipe.title,
          portionDescription: `1 ${t.recipes.servings}`,
          calories: cal?.amount || 0,
          proteinG: prot?.amount || 0,
          carbG: carb?.amount || 0,
          fatG: fat?.amount || 0,
          source: "recipe",
          recipeId: String(recipe.id),
        }),
      });
      toast.success(t.recipes.addedToDay);
      router.push("/dashboard");
    } catch {
      toast.error(t.recipes.saveFailed);
    } finally {
      setLogging(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-6 md:px-8 space-y-4 max-w-3xl mx-auto">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
        </div>
      </div>
    );
  }

  if (!recipe) return null;

  const cal = recipe.nutrition?.nutrients.find((n) => n.name === "Calories");
  const prot = recipe.nutrition?.nutrients.find((n) => n.name === "Protein");
  const carb = recipe.nutrition?.nutrients.find((n) => n.name === "Carbohydrates");
  const fat = recipe.nutrition?.nutrients.find((n) => n.name === "Fat");

  const dietBadges = [
    recipe.vegan && "Vegan",
    recipe.vegetarian && !recipe.vegan && t.recipes.vegetarianLabel,
    recipe.glutenFree && t.recipes.glutenFreeLabel,
    recipe.dairyFree && t.recipes.dairyFree,
    ...recipe.diets,
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero image */}
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-56 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <Heart className={saved ? "h-5 w-5 fill-red-400 text-red-400" : "h-5 w-5"} />
        </button>

        {/* Title on image */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">{recipe.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-white/80 text-sm">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {recipe.readyInMinutes} {t.recipes.minutes}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" /> {recipe.servings} {t.recipes.servings}
            </span>
            {cal && (
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> {Math.round(cal.amount)} kcal
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 md:px-8 space-y-6">
        {/* Diet badges */}
        {dietBadges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dietBadges.slice(0, 5).map((d) => (
              <Badge key={d} variant="secondary" className="text-xs capitalize">{d}</Badge>
            ))}
          </div>
        )}

        {/* Macro cards */}
        {cal && (
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: Flame, label: t.analysis.calorie, value: `${Math.round(cal.amount)}`, unit: "kcal", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950" },
              { icon: ChefHat, label: t.dashboard.protein, value: `${Math.round(prot?.amount || 0)}`, unit: "g", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950" },
              { icon: Wheat, label: t.dashboard.carbs, value: `${Math.round(carb?.amount || 0)}`, unit: "g", color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-950" },
              { icon: Droplets, label: t.dashboard.fat, value: `${Math.round(fat?.amount || 0)}`, unit: "g", color: "text-red-400", bg: "bg-red-50 dark:bg-red-950" },
            ].map(({ icon: Icon, label, value, unit, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
                <Icon className={`h-5 w-5 ${color} mx-auto mb-1`} />
                <p className={`text-base font-bold ${color}`}>{value}</p>
                <p className="text-xs text-muted-foreground">{unit}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add to meal */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
          <p className="text-sm font-semibold">{t.recipes.whichMeal}</p>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_OPTIONS.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setSelectedMeal(m.value)}
                className={`py-2 px-1 rounded-xl text-xs font-medium text-center transition-all border ${
                  selectedMeal === m.value
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <Button
            onClick={handleLog}
            disabled={logging}
            className="w-full bg-primary hover:bg-primary/90 h-11"
          >
            {logging ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {t.recipes.addToToday}
          </Button>
        </div>

        {/* Ingredients */}
        <div>
          <h2 className="text-lg font-semibold mb-3">{t.recipes.ingredients}</h2>
          <div className="space-y-2">
            {recipe.extendedIngredients?.map((ing) => (
              <div
                key={ing.id}
                className="flex items-start gap-3 py-2 border-b border-border last:border-0"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-sm">{ing.original}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {recipe.analyzedInstructions?.[0]?.steps?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">{t.recipes.instructions}</h2>
            <ol className="space-y-4">
              {recipe.analyzedInstructions[0].steps.map((s) => (
                <li key={s.number} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {s.number}
                  </span>
                  <p className="text-sm leading-relaxed pt-0.5">{s.step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Bottom padding for mobile nav */}
        <div className="h-4" />
      </div>
    </div>
  );
}
