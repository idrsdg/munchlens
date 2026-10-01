"use client";

import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Loader2, Flame, X } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/context";

interface FoodResult {
  foodId: string;
  label: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: number;
  servingUnit?: string;
}

interface Props {
  mealType: string;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function YemekAra({ mealType, date, onClose, onSuccess }: Props) {
  const t = useT();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<FoodResult | null>(null);
  const [portion, setPortion] = useState("1");
  const [adding, setAdding] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const MEAL_LABELS: Record<string, string> = {
    kahvalti: t.dashboard.breakfast,
    ogle: t.dashboard.lunch,
    aksam: t.dashboard.dinner,
    ara_ogun: t.dashboard.snack,
  };

  async function search() {
    if (query.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/besin?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.foods || data.hints?.map((h: any) => h.food) || []);
    } catch {
      toast.error(t.food.failedSearch);
    } finally {
      setLoading(false);
    }
  }

  async function addFood() {
    if (!selected) return;
    const multiplier = parseFloat(portion) || 1;
    setAdding(true);
    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          mealType,
          foodName: selected.label,
          portionDescription: `${portion} ${t.food.portion}`,
          calories: Math.round(selected.calories * multiplier),
          proteinG: Math.round((selected.protein || 0) * multiplier),
          carbG: Math.round((selected.carbs || 0) * multiplier),
          fatG: Math.round((selected.fat || 0) * multiplier),
          source: "search",
        }),
      });
      toast.success(`${selected.label} ${t.food.added}`);
      onSuccess();
    } catch {
      toast.error(t.food.failedAdd);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            {t.food.searchTitle}
            <Badge variant="secondary" className="ml-1">{MEAL_LABELS[mealType]}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex gap-2 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={t.food.searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              className="pl-9 rounded-xl"
              autoFocus
            />
          </div>
          <Button onClick={search} disabled={loading || query.length < 2} className="rounded-xl bg-primary hover:bg-primary/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t.food.searchBtn}
          </Button>
        </div>

        {/* Selected food detail */}
        {selected && (
          <div className="bg-orange-50 dark:bg-orange-950/40 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{selected.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {Math.round(selected.calories * (parseFloat(portion) || 1))} kcal / {parseFloat(portion) || 1} {t.food.portion}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={portion}
                onChange={(e) => setPortion(e.target.value)}
                min="0.25"
                step="0.25"
                className="w-20 rounded-xl text-center"
              />
              <span className="text-sm text-muted-foreground">{t.food.portion}</span>
              <Button
                onClick={addFood}
                disabled={adding}
                className="ml-auto bg-primary hover:bg-primary/90 rounded-xl"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4 mr-1" /> {t.food.addToMeal}</>}
              </Button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-1 mt-1">
          {results.map((food) => (
            <button
              key={food.foodId}
              type="button"
              onClick={() => setSelected(food)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-accent transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium">{food.label}</p>
                <p className="text-xs text-muted-foreground">
                  P:{Math.round(food.protein || 0)}g · K:{Math.round(food.carbs || 0)}g · Y:{Math.round(food.fat || 0)}g
                </p>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary ml-3 shrink-0">
                <Flame className="h-3.5 w-3.5" />
                {Math.round(food.calories)}
              </span>
            </button>
          ))}
          {results.length === 0 && !loading && query.length >= 2 && (
            <p className="text-center text-muted-foreground text-sm py-8">{t.food.noResult}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
