"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Flame, TrendingUp, Award, Utensils, Loader2, BarChart2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Analytics {
  dailySummaries: DailySummary[];
  averages: { calories: number; protein: number; carbs: number; fat: number };
  topFoods: Array<{ name: string; count: number }>;
  mealDist: Record<string, number>;
  loggedDays: number;
  streak: number;
  goals: {
    dailyCalorieGoal: number | null;
    proteinGoalG: number | null;
    carbGoalG: number | null;
    fatGoalG: number | null;
  };
}

const PIE_COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7"];

export default function AnalizlerPage() {
  const t = useT();
  const [period, setPeriod] = useState("7");
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const PERIOD_OPTIONS = [
    { value: "7", label: t.analysis.period7 },
    { value: "30", label: t.analysis.period30 },
  ];

  const MEAL_LABELS: Record<string, string> = {
    kahvalti: t.analysis.breakfast,
    ogle: t.analysis.lunch,
    aksam: t.analysis.dinner,
    ara_ogun: t.analysis.snack,
  };

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analizler?period=${period}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!data) return null;

  const { dailySummaries, averages, topFoods, mealDist, loggedDays, streak, goals } = data;

  const chartData = dailySummaries.map((d) => ({
    date: d.date.slice(5),
    kcal: Math.round(d.calories),
  }));

  const mealPieData = Object.entries(mealDist)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: MEAL_LABELS[k] || k, value: v }));

  const macroComparison = [
    { label: t.analysis.protein, avg: averages.protein, goal: goals.proteinGoalG, color: "bg-blue-500" },
    { label: t.analysis.carbs, avg: averages.carbs, goal: goals.carbGoalG, color: "bg-yellow-500" },
    { label: t.analysis.fat, avg: averages.fat, goal: goals.fatGoalG, color: "bg-red-400" },
  ];

  const calGoalPct = goals.dailyCalorieGoal
    ? Math.round((averages.calories / goals.dailyCalorieGoal) * 100)
    : null;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 space-y-5 max-w-3xl mx-auto">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
        alt="Healthy food analytics"
        title={t.analysis.title}
        gradient="dark"
      />
      {/* Period toggle + CSV export */}
      <div className="flex justify-between items-center -mt-2">
        <a
          href="/api/analizler/export"
          download
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors border rounded-xl px-3 py-1.5"
        >
          <Download className="h-3.5 w-3.5" />
          CSV İndir
        </a>
        <div className="flex rounded-xl border overflow-hidden">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                period === p.value ? "bg-orange-500 text-white" : "text-gray-500"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-2">
        <Card>
          <CardContent className="py-3 text-center">
            <Flame className="h-4 w-4 text-orange-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{averages.calories}</p>
            <p className="text-xs text-gray-500">{t.analysis.avgKcal}</p>
            {calGoalPct !== null && (
              <p className={`text-xs font-medium mt-0.5 ${calGoalPct > 110 ? "text-red-400" : calGoalPct >= 90 ? "text-green-500" : "text-yellow-500"}`}>
                %{calGoalPct}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <TrendingUp className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{loggedDays}</p>
            <p className="text-xs text-gray-500">{t.analysis.loggedDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-3 text-center">
            <Award className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
            <p className="text-lg font-bold">{streak}</p>
            <p className="text-xs text-gray-500">{t.analysis.streak}</p>
          </CardContent>
        </Card>
      </div>

      {/* Calorie chart */}
      {chartData.length >= 2 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-orange-400" />
              {t.analysis.dailyCalories}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 9 }} width={35} />
                <Tooltip formatter={(v: number) => [`${v} kcal`, t.analysis.calorie]} />
                <Bar dataKey="kcal" fill="#f97316" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {goals.dailyCalorieGoal && (
              <p className="text-xs text-center text-gray-400 mt-1">
                {t.analysis.goalLabel} {goals.dailyCalorieGoal} kcal/{t.analysis.perDay}
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-gray-400">
            <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">{t.analysis.notEnoughData}</p>
          </CardContent>
        </Card>
      )}

      {/* Macro averages */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">{t.analysis.macroAvg}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {macroComparison.map(({ label, avg, goal, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{label}</span>
                <span>
                  {avg}g {goal ? `/ ${goal}g` : ""}
                  {goal ? ` (%${Math.min(200, Math.round((avg / goal) * 100))})` : ""}
                </span>
              </div>
              {goal && (
                <Progress
                  value={Math.min(100, (avg / goal) * 100)}
                  className={cn("h-2", `[&>*]:${color}`)}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meal distribution */}
      {mealPieData.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <Utensils className="h-4 w-4 text-orange-400" />
              {t.analysis.mealDist}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mealPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                >
                  {mealPieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={8} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top foods */}
      {topFoods.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t.analysis.topFoods}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {topFoods.map((food, i) => (
              <div key={food.name} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium truncate">{food.name}</p>
                </div>
                <span className="text-xs text-gray-400">{food.count}x</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
