"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Barcode, Search, Plus, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/context";

interface Product {
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servingSize?: number;
  servingUnit?: string;
  brand?: string;
}

interface Props {
  mealType: string;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BarkodScanner({ mealType, date, onClose, onSuccess }: Props) {
  const t = useT();
  const [code, setCode] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [portion, setPortion] = useState("100");
  const [adding, setAdding] = useState(false);

  const MEAL_LABELS: Record<string, string> = {
    kahvalti: t.dashboard.breakfast,
    ogle: t.dashboard.lunch,
    aksam: t.dashboard.dinner,
    ara_ogun: t.dashboard.snack,
  };

  async function lookup() {
    if (!code.trim()) return;
    setLoading(true);
    setProduct(null);
    try {
      const res = await fetch(`/api/barkod?code=${encodeURIComponent(code.trim())}`);
      if (!res.ok) {
        toast.error(t.barcode.notFound);
        return;
      }
      const data = await res.json();
      setProduct(data);
    } catch {
      toast.error(t.barcode.failedSearch);
    } finally {
      setLoading(false);
    }
  }

  async function addProduct() {
    if (!product) return;
    const g = parseFloat(portion) || 100;
    const multiplier = g / 100;
    setAdding(true);
    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          mealType,
          foodName: product.name,
          portionGrams: g,
          portionDescription: `${g}g`,
          calories: Math.round(product.calories * multiplier),
          proteinG: Math.round((product.protein || 0) * multiplier),
          carbG: Math.round((product.carbs || 0) * multiplier),
          fatG: Math.round((product.fat || 0) * multiplier),
          source: "barcode",
          barcode: code,
        }),
      });
      toast.success(`${product.name} ${t.barcode.added}`);
      onSuccess();
    } catch {
      toast.error(t.barcode.failedAdd);
    } finally {
      setAdding(false);
    }
  }

  const g = parseFloat(portion) || 100;
  const mult = g / 100;

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[75vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Barcode className="h-4 w-4 text-primary" />
            {t.barcode.title}
            <Badge variant="secondary">{MEAL_LABELS[mealType]}</Badge>
          </SheetTitle>
        </SheetHeader>

        <div className="flex gap-2 mt-2">
          <div className="relative flex-1">
            <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t.barcode.placeholder}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookup()}
              className="pl-9 rounded-xl font-mono tracking-wider"
              inputMode="numeric"
              autoFocus
            />
          </div>
          <Button onClick={lookup} disabled={loading || !code.trim()} className="rounded-xl bg-primary hover:bg-primary/90">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">{t.barcode.hint}</p>

        {/* Product result */}
        {product && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 mt-2">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">{product.name}</p>
                {product.brand && (
                  <p className="text-xs text-muted-foreground">{product.brand}</p>
                )}
              </div>
            </div>

            {/* Macro per portion */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { label: t.barcode.calories, value: `${Math.round(product.calories * mult)}`, unit: "kcal", color: "text-orange-500" },
                { label: t.barcode.protein, value: `${Math.round((product.protein || 0) * mult)}`, unit: "g", color: "text-blue-500" },
                { label: t.barcode.carbs, value: `${Math.round((product.carbs || 0) * mult)}`, unit: "g", color: "text-yellow-500" },
                { label: t.barcode.fat, value: `${Math.round((product.fat || 0) * mult)}`, unit: "g", color: "text-red-400" },
              ].map(({ label, value, unit, color }) => (
                <div key={label} className="bg-muted/50 rounded-xl p-2">
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                  <p className="text-muted-foreground">{unit}</p>
                  <p className="text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={portion}
                  onChange={(e) => setPortion(e.target.value)}
                  className="w-20 rounded-xl text-center"
                  min="1"
                />
                <span className="text-sm text-muted-foreground">{t.barcode.gram}</span>
              </div>
              <Button
                onClick={addProduct}
                disabled={adding}
                className="flex-1 bg-primary hover:bg-primary/90 rounded-xl"
              >
                {adding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {t.barcode.addToMeal}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
