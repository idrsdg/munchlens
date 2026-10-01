"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Clock, Flame, BookOpen, ChefHat,
  Loader2, Filter, UtensilsCrossed, Heart, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import PageHeroBanner from "@/components/page-hero-banner";
import { useT } from "@/lib/i18n/context";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  calories?: number;
  missedIngredientCount?: number;
}

export default function TariflerPage() {
  const t = useT();
  const [tab, setTab] = useState<"discover" | "ingredients">("discover");
  const [query, setQuery] = useState("");
  const [mealType, setMealType] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const MEAL_TYPES = [
    { value: "", label: t.recipes.all },
    { value: "breakfast", label: t.analysis.breakfast },
    { value: "main course", label: t.recipes.mainCourse },
    { value: "salad", label: t.recipes.salad },
    { value: "soup", label: t.recipes.soup },
    { value: "dessert", label: t.recipes.dessert },
    { value: "snack", label: t.recipes.snackType },
  ];

  const TIME_FILTERS = [
    { value: "", label: t.recipes.anyDuration },
    { value: "15", label: t.recipes.time15 },
    { value: "30", label: t.recipes.time30 },
    { value: "60", label: t.recipes.time60 },
  ];

  const TABS = [
    { key: "discover", label: t.recipes.tabDiscover, icon: BookOpen },
    { key: "ingredients", label: t.recipes.tabIngredients, icon: ChefHat },
  ];

  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (tab === "discover") {
        if (query) params.set("q", query);
        if (mealType) params.set("type", mealType);
        if (maxTime) params.set("maxTime", maxTime);
      } else {
        if (ingredients) params.set("ingredients", ingredients);
      }
      const res = await fetch(`/api/tarifler?${params}`);
      const data = await res.json();
      setRecipes(data.results || []);
    } catch {
      // silent error
    } finally {
      setLoading(false);
    }
  }, [tab, query, mealType, maxTime, ingredients]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 space-y-5 max-w-5xl mx-auto">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1200&q=80"
        alt="Cooking and recipes"
        title={t.recipes.title}
        subtitle={t.recipes.subtitle}
        gradient="orange"
        badge="🍽️"
      />
      {/* Filter toggle */}
      <div className="flex justify-end -mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn("gap-1.5", showFilters && "text-primary")}
        >
          <Filter className="h-4 w-4" />
          <span className="text-xs">{t.recipes.filter}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl border border-border overflow-hidden">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => { setTab(key as any); setRecipes([]); }}
            className={cn(
              "flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
              tab === key ? "bg-primary text-white" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      {tab === "discover" && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.recipes.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
      )}

      {tab === "ingredients" && (
        <div className="space-y-2.5">
          <div className="relative">
            <ChefHat className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.recipes.ingredientsPlaceholder}
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchRecipes()}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
          <Button
            onClick={fetchRecipes}
            className="w-full bg-primary hover:bg-primary/90 h-11 rounded-xl"
            disabled={loading || !ingredients}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            {t.recipes.findRecipe}
          </Button>
        </div>
      )}

      {/* Filters */}
      {showFilters && tab === "discover" && (
        <div className="space-y-4 bg-muted/50 rounded-2xl p-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t.recipes.category}</p>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMealType(m.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    mealType === m.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground bg-card"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{t.recipes.prepTime}</p>
            <div className="flex gap-2">
              {TIME_FILTERS.map((tf) => (
                <button
                  key={tf.value}
                  type="button"
                  onClick={() => setMaxTime(tf.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    maxTime === tf.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground bg-card"
                  )}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>
          <Button size="sm" onClick={fetchRecipes} className="w-full bg-primary hover:bg-primary/90 rounded-xl">
            {t.recipes.apply}
          </Button>
        </div>
      )}

      {/* Recipe list */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="h-8 w-8 opacity-40" />
          </div>
          <p className="text-sm">{t.recipes.noResults}</p>
          <p className="text-xs mt-1">{t.recipes.tryDifferent}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {recipes.map((recipe) => {
            const cal = recipe.calories ? Math.round(recipe.calories) : null;
            return (
              <Link key={recipe.id} href={`/tarifler/${recipe.id}`}>
                <Card className="overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full border-border">
                  <div className="relative">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {recipe.missedIngredientCount === 0 && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-xs px-1.5 py-0.5">
                        ✓ {t.recipes.perfectMatch}
                      </Badge>
                    )}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <p className="text-sm font-medium line-clamp-2 leading-snug">{recipe.title}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      {recipe.readyInMinutes && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{recipe.readyInMinutes}{t.recipes.minutes}
                        </span>
                      )}
                      {cal && (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <Flame className="h-3 w-3" />{cal}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
