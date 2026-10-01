"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import KaloriHalka from "@/components/kalori-halka/kalori-halka";
import FotografYukle from "@/components/fotograf-yukle/fotograf-yukle";
import YemekAra from "@/components/yemek-ara/yemek-ara";
import BarkodScanner from "@/components/barkod-scanner/barkod-scanner";
import { Camera, Search, Barcode, Plus, Droplets, Flame, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

interface Props {
  user: any;
  logs: any[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
  totalWaterMl: number;
  today: string;
  todayPlan?: any;
  recentFoods?: any[];
}

export default function DashboardClient({ user, logs, totals, totalWaterMl, today, todayPlan, recentFoods }: Props) {
  const t = useT();
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [showPlan, setShowPlan] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState<string>("ogle");
  const [waterMl, setWaterMl] = useState(totalWaterMl);
  const [waterLoading, setWaterLoading] = useState(false);

  const MEAL_LABELS: Record<string, string> = {
    kahvalti: t.dashboard.breakfast,
    ogle: t.dashboard.lunch,
    aksam: t.dashboard.dinner,
    ara_ogun: t.dashboard.snack,
  };

  async function addWater(ml: number) {
    const newVal = Math.max(0, waterMl + ml);
    if (ml < 0 && waterMl === 0) return;
    setWaterLoading(true);
    setWaterMl(newVal);
    try {
      await fetch("/api/su", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, amountMl: ml }),
      });
    } catch {
      setWaterMl((prev) => prev - ml);
    } finally {
      setWaterLoading(false);
    }
  }

  const calorieGoal = user?.dailyCalorieGoal || 2000;
  const proteinGoal = user?.proteinGoalG || 150;
  const carbGoal = user?.carbGoalG || 250;
  const fatGoal = user?.fatGoalG || 65;
  const waterGoal = user?.waterGoalMl || 2000;

  const remaining = Math.max(0, calorieGoal - totals.calories);

  const mealGroups = logs.reduce((acc: Record<string, any[]>, log) => {
    const mt = log.mealType || "ara_ogun";
    if (!acc[mt]) acc[mt] = [];
    acc[mt].push(log);
    return acc;
  }, {});

  const dateDisplay = new Date(today).toLocaleDateString(t.dateLocale as any, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 space-y-5 max-w-3xl mx-auto">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80"
        alt="Healthy colorful food bowl"
        title={`${t.dashboard.greeting}, ${user?.name?.split(" ")[0] || t.dashboard.defaultUser} 👋`}
        subtitle={dateDisplay}
        badge={user?.currentStreak > 0 ? `🔥 ${user.currentStreak} ${t.dashboard.streak}` : undefined}
        gradient="orange"
      />

      {/* Kalori Kartı */}
      <Card className="border-border">
        <CardContent className="pt-6 pb-5">
          <div className="flex items-center gap-6">
            <KaloriHalka consumed={totals.calories} goal={calorieGoal} size={110} />
            <div className="flex-1 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.dashboard.consumed}</span>
                <span className="font-bold text-primary text-base">{Math.round(totals.calories)} {t.common.kcal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.dashboard.goal}</span>
                <span className="font-medium">{calorieGoal} {t.common.kcal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t.dashboard.remaining}</span>
                <span className={`font-bold text-base ${remaining === 0 ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
                  {remaining === 0 ? t.dashboard.full : `${Math.round(remaining)} ${t.common.kcal}`}
                </span>
              </div>
            </div>
          </div>

          {/* Makrolar */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            {[
              { label: t.dashboard.protein, value: totals.protein, goal: proteinGoal, cls: "bg-blue-100 dark:bg-blue-950 [&>*]:bg-blue-500" },
              { label: t.dashboard.carbs,   value: totals.carbs,   goal: carbGoal,    cls: "bg-yellow-100 dark:bg-yellow-950 [&>*]:bg-yellow-500" },
              { label: t.dashboard.fat,     value: totals.fat,     goal: fatGoal,     cls: "bg-red-100 dark:bg-red-950 [&>*]:bg-red-400" },
            ].map(({ label, value, goal, cls }) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span className="font-medium">{label}</span>
                  <span>{Math.round(value)}g</span>
                </div>
                <Progress value={Math.min(100, (value / goal) * 100)} className={`h-2 ${cls}`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Su Takibi */}
      <Card>
        <CardContent className="py-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">{t.dashboard.water}</span>
              <span className="text-sm text-gray-500">{waterMl}{t.common.ml} / {waterGoal}{t.common.ml}</span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={`w-4 h-6 rounded-sm transition-colors ${i < Math.floor(waterMl / (waterGoal / 8)) ? "bg-blue-400" : "bg-gray-200"}`} />
              ))}
            </div>
          </div>
          <div className="flex gap-1.5">
            <button type="button" disabled={waterLoading || waterMl === 0} onClick={() => addWater(-250)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-40">
              −250{t.common.ml}
            </button>
            {[250, 500].map((ml) => (
              <button key={ml} type="button" disabled={waterLoading} onClick={() => addWater(ml)}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors disabled:opacity-50">
                +{ml}{t.common.ml}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Yemek Ekle Butonları */}
      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" className="flex-col h-20 gap-2 rounded-2xl border-border hover:border-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 group transition-all"
          onClick={() => setShowPhotoUpload(true)}>
          <Camera className="h-6 w-6 text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">{t.dashboard.photo}</span>
        </Button>
        <Button variant="outline" className="flex-col h-20 gap-2 rounded-2xl border-border hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 group transition-all"
          onClick={() => setShowSearch(true)}>
          <Search className="h-6 w-6 text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">{t.dashboard.search}</span>
        </Button>
        <Button variant="outline" className="flex-col h-20 gap-2 rounded-2xl border-border hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-950/30 group transition-all"
          onClick={() => setShowBarcode(true)}>
          <Barcode className="h-6 w-6 text-green-500 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium">{t.dashboard.barcode}</span>
        </Button>
      </div>

      {/* Bugünkü AI Planı */}
      {todayPlan && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-orange-50 dark:to-orange-950/20">
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-primary" />
                {t.dashboard.todayPlan}
              </CardTitle>
              <button
                type="button"
                onClick={() => setShowPlan((v) => !v)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPlan ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </CardHeader>
          {showPlan && (
            <CardContent className="pt-0 px-4 pb-3 space-y-2">
              {[
                { key: "kahvalti", emoji: "☀️", label: t.dashboard.breakfast },
                { key: "ogle", emoji: "🌤️", label: t.dashboard.lunch },
                { key: "aksam", emoji: "🌙", label: t.dashboard.dinner },
                { key: "ara_ogun", emoji: "🍎", label: t.dashboard.snack },
              ].map(({ key, emoji, label }) => {
                const meal = todayPlan.meals?.[key];
                if (!meal) return null;
                return (
                  <div key={key} className="flex items-start gap-2.5 text-sm">
                    <span className="text-base shrink-0 mt-0.5">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-muted-foreground">{label.replace(/[☀️🌤️🌙🍎]\s?/u, "")}</p>
                      <p className="font-semibold text-sm leading-snug truncate">{meal.name}</p>
                      <p className="text-xs text-muted-foreground">{meal.portion}</p>
                    </div>
                    <span className="text-xs text-primary font-bold shrink-0 flex items-center gap-0.5 mt-1">
                      <Flame className="h-3 w-3" />{meal.calories}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          )}
        </Card>
      )}

      {/* Öğün Listesi */}
      <div className="space-y-3">
        {(["kahvalti", "ogle", "aksam", "ara_ogun"] as const).map((meal) => {
          const mealLogs = mealGroups[meal] || [];
          const mealCal = mealLogs.reduce((s: number, l: any) => s + (l.calories || 0), 0);
          return (
            <Card key={meal}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{MEAL_LABELS[meal]}</CardTitle>
                  <div className="flex items-center gap-2">
                    {mealCal > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Flame className="h-3 w-3" />{Math.round(mealCal)} {t.common.kcal}
                      </span>
                    )}
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0"
                      onClick={() => { setSelectedMeal(meal); setShowSearch(true); }}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {mealLogs.length > 0 && (
                <CardContent className="pt-0 px-4 pb-3">
                  <div className="space-y-1.5">
                    {mealLogs.map((log: any) => (
                      <div key={log.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{log.foodName}</span>
                        <div className="flex items-center gap-2 text-gray-500">
                          <span className="text-xs">{log.portionDescription}</span>
                          <span className="font-medium text-gray-700">{Math.round(log.calories)} {t.common.kcal}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Son Yenenler */}
      {recentFoods && recentFoods.length > 0 && (
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-sm font-semibold">{t.dashboard.recentFoods}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-3">
            <div className="grid grid-cols-2 gap-2">
              {recentFoods.map((food: any) => (
                <button
                  key={food.foodName}
                  type="button"
                  onClick={async () => {
                    try {
                      await fetch("/api/log", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          date: today,
                          mealType: selectedMeal,
                          foodName: food.foodName,
                          calories: food.calories,
                          proteinG: food.proteinG,
                          carbG: food.carbG,
                          fatG: food.fatG,
                          portionDescription: food.portionDescription,
                          source: "manual",
                        }),
                      });
                      window.location.reload();
                    } catch {}
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 hover:bg-primary/10 hover:border-primary/30 border border-border transition-all text-left group"
                >
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-950 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-sm">🍽️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate group-hover:text-primary">{food.foodName}</p>
                    <p className="text-[10px] text-muted-foreground">{Math.round(food.calories)} {t.common.kcal}</p>
                  </div>
                  <Plus className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {showPhotoUpload && (
        <FotografYukle mealType={selectedMeal} date={today} onClose={() => setShowPhotoUpload(false)}
          onSuccess={() => { setShowPhotoUpload(false); window.location.reload(); }} />
      )}
      {showSearch && (
        <YemekAra mealType={selectedMeal} date={today} onClose={() => setShowSearch(false)}
          onSuccess={() => { setShowSearch(false); window.location.reload(); }} />
      )}
      {showBarcode && (
        <BarkodScanner mealType={selectedMeal} date={today} onClose={() => setShowBarcode(false)}
          onSuccess={() => { setShowBarcode(false); window.location.reload(); }} />
      )}
    </div>
  );
}
