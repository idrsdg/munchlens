"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Loader2, Sparkles, Plus, Trash2, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

interface ShoppingItem { name: string; category: string; checked: boolean; quantity?: string; }
interface ShoppingList { id: string; title: string; items: ShoppingItem[]; createdAt: string; }

// Stable key → emoji mapping (locale-independent)
const CAT_KEYS = ["meat", "dairy", "grain", "fruit", "vegetable", "legume", "sauce", "beverage", "nuts", "other"] as const;
type CatKey = typeof CAT_KEYS[number];
const CAT_EMOJI: Record<CatKey, string> = {
  meat: "🥩", dairy: "🥛", grain: "🍞", fruit: "🍎",
  vegetable: "🥦", legume: "🫘", sauce: "🧂", beverage: "🧃",
  nuts: "🥜", other: "🛒",
};

// Legacy string→emoji lookup for items already stored with translated names
const LEGACY_CATEGORY_EMOJI: Record<string, string> = {
  "Et & Balık": "🥩", "Süt Ürünleri": "🥛", "Tahıl & Ekmek": "🍞",
  "Meyve": "🍎", "Sebze": "🥦", "Baklagil": "🫘",
  "Sos & Baharat": "🧂", "İçecek": "🧃", "Kuruyemiş": "🥜", "Diğer": "🛒",
  "Meat & Fish": "🥩", "Dairy": "🥛", "Grains & Bread": "🍞",
  "Fruit": "🍎", "Vegetables": "🥦", "Legumes": "🫘",
  "Sauces & Spices": "🧂", "Beverages": "🧃", "Nuts": "🥜", "Other": "🛒",
  "Viande & Poisson": "🥩", "Produits laitiers": "🥛", "Céréales & Pain": "🍞",
  "Fruits": "🍎", "Légumes": "🥦", "Légumineuses": "🫘",
  "Sauces & Épices": "🧂", "Boissons": "🧃", "Fruits secs": "🥜", "Autre": "🛒",
  "Carne & Pescado": "🥩", "Lácteos": "🥛", "Cereales & Pan": "🍞",
  "Fruta": "🍎", "Verduras": "🥦", "Legumbres": "🫘",
  "Salsas & Especias": "🧂", "Bebidas": "🧃", "Frutos secos": "🥜", "Otros": "🛒",
};

export default function AlisverisPage() {
  const t = useT();
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newCategory, setNewCategory] = useState<CatKey>("other");

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/alisveris");
      setList((await res.json()).list);
    } catch { toast.error(t.shopping.failedLoad); }
    finally { setLoading(false); }
  }
  useEffect(() => { fetchList(); }, []);

  async function generateFromPlan() {
    setGenerating(true);
    try {
      const res = await fetch("/api/alisveris", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      setList((await res.json()).list);
      toast.success(t.shopping.success);
    } catch (e: any) { toast.error(e.message || t.shopping.failedGenerate); }
    finally { setGenerating(false); }
  }

  async function toggleItem(index: number) {
    if (!list) return;
    const updated = list.items.map((item, i) => i === index ? { ...item, checked: !item.checked } : item);
    setList({ ...list, items: updated });
    try {
      await fetch("/api/alisveris", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_items", listId: list.id, items: updated }),
      });
    } catch { toast.error(t.shopping.failedUpdate); fetchList(); }
  }

  async function addItem() {
    if (!newItem.trim() || !list) { if (!list) toast.error(t.shopping.noPlan); return; }
    const item: ShoppingItem = { name: newItem.trim(), category: t.shopping.categories[newCategory], checked: false };
    setList({ ...list, items: [...list.items, item] });
    setNewItem("");
    try {
      await fetch("/api/alisveris", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add_item", listId: list.id, item }),
      });
    } catch { toast.error(t.shopping.failedAdd); fetchList(); }
  }

  async function clearChecked() {
    if (!list) return;
    const remaining = list.items.filter((i) => !i.checked);
    setList({ ...list, items: remaining });
    try {
      await fetch("/api/alisveris", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_items", listId: list.id, items: remaining }),
      });
      toast.success(t.shopping.clearedSuccess);
    } catch { toast.error(t.shopping.failedUpdate); fetchList(); }
  }

  const grouped = list?.items.reduce<Record<string, { item: ShoppingItem; index: number }[]>>((acc, item, i) => {
    const cat = item.category || "Diğer";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ item, index: i });
    return acc;
  }, {}) ?? {};

  const total = list?.items.length ?? 0;
  const checked = list?.items.filter((i) => i.checked).length ?? 0;
  const pct = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto space-y-5">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80"
        alt="Fresh produce and grocery shopping"
        title={t.shopping.title}
        subtitle={list?.title ?? undefined}
        gradient="green"
      />

      {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

      {!loading && !list && (
        <div className="flex flex-col items-center py-20 gap-6 text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-10 w-10 text-emerald-600" />
            </div>
            <span className="absolute -top-1 -right-1 text-2xl">✨</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.shopping.noList}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">{t.shopping.noListDesc}</p>
          </div>
          <Button onClick={generateFromPlan} disabled={generating}
            className="w-full max-w-xs h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 shadow-lg shadow-emerald-500/25 font-semibold">
            {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />{t.shopping.generating}</> : <><Sparkles className="h-4 w-4 mr-2" />{t.shopping.generateBtn}</>}
          </Button>
          <p className="text-xs text-muted-foreground">{t.shopping.noListNote}</p>
        </div>
      )}

      {!loading && list && (
        <>
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">{t.shopping.progress}</p>
              <span className="text-sm text-muted-foreground">{checked} / {total} {t.shopping.completed}</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between items-center pt-1">
              <Badge variant="outline" className="text-xs">%{pct} {t.shopping.completed}</Badge>
              {checked > 0 && (
                <button type="button" onClick={clearChecked}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                  <Trash2 className="h-3 w-3" />{t.shopping.clearChecked}
                </button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />{t.shopping.addItem}
            </p>
            <div className="flex gap-2">
              <Input placeholder={t.shopping.addPlaceholder} value={newItem}
                onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()}
                className="flex-1 rounded-xl" />
              <Button onClick={addItem} disabled={!newItem.trim()} className="rounded-xl bg-primary hover:bg-primary/90 px-4 shrink-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as CatKey)}
              className="w-full text-sm border border-border rounded-xl px-3 py-2 bg-background">
              {CAT_KEYS.map((key) => (
                <option key={key} value={key}>{CAT_EMOJI[key]} {t.shopping.categories[key]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([category, entries]) => (
              <div key={category} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 bg-muted/40 border-b border-border flex items-center gap-2">
                  <span>{LEGACY_CATEGORY_EMOJI[category] ?? "🛒"}</span>
                  <p className="text-sm font-semibold">{category}</p>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {entries.filter((e) => !e.item.checked).length} {t.shopping.left}
                  </Badge>
                </div>
                <div className="divide-y divide-border">
                  {entries.map(({ item, index }) => (
                    <button key={index} type="button" onClick={() => toggleItem(index)}
                      className={cn("w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                        item.checked ? "opacity-50 bg-muted/20" : "hover:bg-accent")}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                        item.checked ? "bg-emerald-500 border-emerald-500" : "border-border")}>
                        {item.checked && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={cn("text-sm font-medium flex-1", item.checked && "line-through text-muted-foreground")}>{item.name}</span>
                      {item.quantity && <span className="text-xs text-muted-foreground shrink-0">{item.quantity}</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" onClick={generateFromPlan} disabled={generating} className="w-full rounded-2xl h-11">
            {generating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            {t.shopping.generateBtnShort}
          </Button>
        </>
      )}
    </div>
  );
}
