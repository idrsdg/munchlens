"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, Loader2, CalendarDays, Flame, Beef, Wheat, Droplets,
  ChevronLeft, ChevronRight, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

interface MealItem {
  name: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
interface DayPlan {
  dayName: string;
  meals: { kahvalti: MealItem; ogle: MealItem; aksam: MealItem; ara_ogun: MealItem };
  totalCalories: number;
}
interface Plan {
  id: string;
  weekStartDate: string;
  planData: { days: DayPlan[] };
  totalCaloriesAvg: number;
  createdAt: string;
}

function getMonday(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date.toISOString().split("T")[0];
}
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr); d.setDate(d.getDate() + n); return d;
}

function MacroPill({ icon: Icon, value, unit, color }: { icon: any; value: number; unit: string; color: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", color)}>
      <Icon className="h-3 w-3" />{value}{unit}
    </span>
  );
}

function MealCard({ type, meal, labels, macros }: {
  type: string;
  meal: MealItem;
  labels: Record<string, { label: string; emoji: string; bg: string }>;
  macros: { protein: string; carbs: string; fat: string };
}) {
  const cfg = labels[type];
  return (
    <div className={cn("rounded-2xl bg-gradient-to-br border border-border p-4 space-y-2", cfg.bg)}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{cfg.emoji}</span>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cfg.label}</p>
        <Badge variant="outline" className="ml-auto text-xs font-bold">
          <Flame className="h-3 w-3 mr-0.5 text-orange-500" />{meal.calories} kcal
        </Badge>
      </div>
      <p className="font-semibold text-sm leading-snug">{meal.name}</p>
      <p className="text-xs text-muted-foreground">{meal.portion}</p>
      <div className="flex gap-3 pt-1">
        <MacroPill icon={Beef}    value={meal.protein} unit={`g ${macros.protein}`} color="text-blue-600" />
        <MacroPill icon={Wheat}   value={meal.carbs}   unit={`g ${macros.carbs}`}   color="text-amber-600" />
        <MacroPill icon={Droplets} value={meal.fat}    unit={`g ${macros.fat}`}     color="text-rose-500" />
      </div>
    </div>
  );
}

export default function PlanPage() {
  const t = useT();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [weekStart] = useState(getMonday());

  const MEAL_LABELS: Record<string, { label: string; emoji: string; bg: string }> = {
    kahvalti: { label: t.plan.breakfast, emoji: "☀️", bg: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30" },
    ogle:     { label: t.plan.lunch,     emoji: "🌤️", bg: "from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30" },
    aksam:    { label: t.plan.dinner,    emoji: "🌙", bg: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30" },
    ara_ogun: { label: t.plan.snack,     emoji: "🍎", bg: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30" },
  };

  const fetchPlan = useCallback(async () => {
    setLoadingPlan(true);
    try {
      const res = await fetch(`/api/plan?week=${weekStart}`);
      const data = await res.json();
      setPlan(data.plan);
    } catch { toast.error(t.plan.failedLoad); }
    finally { setLoadingPlan(false); }
  }, [weekStart, t.plan.failedLoad]);

  useEffect(() => { fetchPlan(); }, [fetchPlan]);

  async function generate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/plan", { method: "POST" });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      const data = await res.json();
      setPlan(data.plan);
      setSelectedDay(0);
      toast.success(t.plan.success);
    } catch (e: any) {
      toast.error(e.message || t.plan.failedGenerate);
    } finally { setGenerating(false); }
  }

  const dayTabs = plan?.planData?.days?.map((d, i) => {
    const date = addDays(weekStart, i);
    const isToday = date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0];
    return { label: d.dayName.slice(0, 3), date: date.getDate(), isToday };
  }) ?? [];

  const currentDay = plan?.planData?.days?.[selectedDay];

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto space-y-5">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80"
        alt="Meal prep containers"
        title={t.plan.title}
        subtitle={`${new Date(weekStart).toLocaleDateString(t.dateLocale as any, { day: "numeric", month: "long" })} ${t.plan.subtitle}`}
        gradient="green"
        badge="AI"
      />
      <div className="flex items-start justify-between -mt-2">
        <div />
        {plan && (
          <Button variant="outline" size="sm" onClick={generate} disabled={generating} className="rounded-xl shrink-0">
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-1.5 hidden sm:inline">{t.plan.refresh}</span>
          </Button>
        )}
      </div>

      {loadingPlan && <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

      {!loadingPlan && !plan && (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-orange-200 dark:to-orange-900 rounded-full flex items-center justify-center">
              <CalendarDays className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{t.plan.noplan}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">{t.plan.noplanDesc}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center w-full max-w-xs">
            {[
              { emoji: "🍽️", label: t.plan.sevenDaysFeat },
              { emoji: "⚡", label: t.plan.fourMealsFeat },
              { emoji: "🎯", label: t.plan.personalFeat },
            ].map((f) => (
              <div key={f.label} className="bg-card border border-border rounded-xl p-3">
                <p className="text-2xl">{f.emoji}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{f.label}</p>
              </div>
            ))}
          </div>
          <Button onClick={generate} disabled={generating}
            className="w-full max-w-xs h-13 rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 shadow-lg shadow-primary/25 font-bold text-base">
            {generating ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />{t.plan.generating}</> : <><Sparkles className="h-5 w-5 mr-2" />{t.plan.generate}</>}
          </Button>
          <p className="text-xs text-muted-foreground">{t.plan.generatingTime}</p>
        </div>
      )}

      {!loadingPlan && plan && (
        <>
          <div className="bg-gradient-to-r from-primary to-orange-500 rounded-2xl p-4 text-white flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80">{t.plan.weeklyAvg}</p>
              <p className="text-3xl font-black">{Math.round(plan.totalCaloriesAvg)}</p>
              <p className="text-sm text-white/80">{t.plan.perDay}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-xs">{t.plan.sevenDays}</p>
              <p className="text-4xl mt-1">🍽️</p>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {dayTabs.map((d, i) => (
              <button key={i} type="button" onClick={() => setSelectedDay(i)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl border-2 transition-all shrink-0",
                  selectedDay === i ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-accent",
                  d.isToday && selectedDay !== i && "border-dashed border-primary/50"
                )}>
                <span className={cn("text-xs font-semibold", selectedDay === i ? "text-primary" : "text-muted-foreground")}>{d.label}</span>
                <span className={cn("text-lg font-black", selectedDay === i ? "text-primary" : "")}>{d.date}</span>
                {d.isToday && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>

          {currentDay && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-lg font-bold">{currentDay.dayName}</h2>
                {dayTabs[selectedDay]?.isToday && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">{t.plan.today}</Badge>
                )}
              </div>
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-primary/10 to-orange-100 dark:to-orange-950/30 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">{t.plan.daily}</p>
                  <div className="flex items-center gap-1.5 text-primary font-black text-lg">
                    <Flame className="h-5 w-5" />{currentDay.totalCalories} kcal
                  </div>
                </div>
                {(["kahvalti", "ogle", "aksam", "ara_ogun"] as const).map((m) => (
                  <MealCard key={m} type={m} meal={currentDay.meals[m]} labels={MEAL_LABELS} macros={{ protein: t.dashboard.protein, carbs: t.dashboard.carbs, fat: t.dashboard.fat }} />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedDay((d) => Math.max(0, d - 1))} disabled={selectedDay === 0} className="rounded-xl">
              <ChevronLeft className="h-4 w-4" /> {t.plan.prev}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelectedDay((d) => Math.min(6, d + 1))} disabled={selectedDay === 6} className="rounded-xl">
              {t.plan.next} <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {generating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-xl shadow-primary/30">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <p className="text-xl font-bold">{t.plan.generating}</p>
          <p className="text-sm text-muted-foreground">{t.plan.generatingMessage}</p>
          <div className="flex gap-1.5 mt-2">
            {["🥗", "🍳", "🍲", "🍎"].map((e, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>{e}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
