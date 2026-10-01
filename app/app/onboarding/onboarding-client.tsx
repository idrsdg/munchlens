"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Check, Zap } from "lucide-react";
import { useT } from "@/lib/i18n/context";

// --- Types ---
type GoalType = "ver" | "kor" | "al";
type ActivityLevel = "hareketsiz" | "az_aktif" | "orta" | "cok_aktif";
type DietType = "normal" | "vegan" | "vejetaryen" | "keto" | "paleo" | "glutensiz" | "helal";

interface FormData {
  goalType: GoalType | null;
  gender: "male" | "female" | null;
  age: string;
  heightCm: string;
  weightKg: string;
  targetWeightKg: string;
  activityLevel: ActivityLevel | null;
  dietType: DietType;
  allergies: string[];
}

function calcMacros(data: FormData) {
  const age = parseInt(data.age);
  const h = parseFloat(data.heightCm);
  const w = parseFloat(data.weightKg);
  if (!age || !h || !w || !data.gender || !data.activityLevel || !data.goalType) return null;

  const bmr = data.gender === "male"
    ? 10 * w + 6.25 * h - 5 * age + 5
    : 10 * w + 6.25 * h - 5 * age - 161;

  const mult: Record<ActivityLevel, number> = { hareketsiz: 1.2, az_aktif: 1.375, orta: 1.55, cok_aktif: 1.725 };
  let tdee = bmr * mult[data.activityLevel];
  if (data.goalType === "ver") tdee -= 400;
  else if (data.goalType === "al") tdee += 400;

  const calories = Math.round(tdee);
  return {
    calories,
    protein: Math.round((calories * 0.25) / 4),
    carbs: Math.round((calories * 0.45) / 4),
    fat: Math.round((calories * 0.30) / 9),
  };
}

// ─── STEP 1: Goal ─────────────────────────────────────────────────────────────
function StepGoal({ value, onChange }: { value: GoalType | null; onChange: (v: GoalType) => void }) {
  const t = useT();
  const goals = [
    {
      key: "ver" as GoalType,
      emoji: "🔥",
      label: t.onboarding.goalLose,
      desc: t.onboarding.goalLoseDesc,
      gradient: "from-orange-400 to-rose-500",
      glow: "shadow-orange-200 dark:shadow-orange-900",
      badge: t.onboarding.goalLoseBadge,
      fact: t.onboarding.goalLoseFact,
    },
    {
      key: "kor" as GoalType,
      emoji: "⚡",
      label: t.onboarding.goalKeep,
      desc: t.onboarding.goalKeepDesc,
      gradient: "from-emerald-400 to-teal-500",
      glow: "shadow-emerald-200 dark:shadow-emerald-900",
      badge: t.onboarding.goalKeepBadge,
      fact: t.onboarding.goalKeepFact,
    },
    {
      key: "al" as GoalType,
      emoji: "💪",
      label: t.onboarding.goalGain,
      desc: t.onboarding.goalGainDesc,
      gradient: "from-violet-400 to-purple-600",
      glow: "shadow-violet-200 dark:shadow-violet-900",
      badge: t.onboarding.goalGainBadge,
      fact: t.onboarding.goalGainFact,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Stats banner */}
      <div className="bg-gradient-to-r from-primary/20 to-orange-100 dark:to-orange-950/30 rounded-2xl p-4 flex items-center gap-3 mb-5">
        <span className="text-3xl">📊</span>
        <div>
          <p className="text-sm font-semibold">{t.onboarding.statsBanner}</p>
          <p className="text-xs text-muted-foreground">{t.onboarding.statsBannerSub}</p>
        </div>
      </div>

      {goals.map((g) => {
        const selected = value === g.key;
        return (
          <button
            key={g.key}
            type="button"
            onClick={() => onChange(g.key)}
            className={cn(
              "w-full text-left rounded-2xl overflow-hidden transition-all duration-300",
              selected ? `shadow-lg ${g.glow} scale-[1.02]` : "hover:scale-[1.01]"
            )}
          >
            <div className={cn(
              "bg-gradient-to-r p-4 flex items-center gap-4 text-white",
              g.gradient
            )}>
              <span className="text-4xl drop-shadow">{g.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-lg">{g.label}</p>
                  <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">{g.badge}</span>
                </div>
                <p className="text-sm text-white/80">{g.desc}</p>
              </div>
              <div className={cn(
                "w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shrink-0",
                selected ? "bg-white" : "bg-transparent"
              )}>
                {selected && <Check className="h-3.5 w-3.5 text-gray-700" />}
              </div>
            </div>
            <div className="bg-card border-x border-b border-border px-4 py-2 flex items-center gap-2">
              <Zap className="h-3 w-3 text-amber-500 shrink-0" />
              <p className="text-xs text-muted-foreground">{g.fact}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── STEP 2: Personal Info ─────────────────────────────────────────────────────
function StepPersonal({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  const t = useT();
  return (
    <div className="space-y-6">
      {/* Info card */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-2xl p-4 flex gap-3">
        <span className="text-2xl">🧬</span>
        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
          {t.onboarding.bmrInfo}
        </p>
      </div>

      {/* Gender */}
      <div>
        <p className="text-sm font-semibold mb-3">{t.onboarding.gender}</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "male", label: t.onboarding.genderMale, emoji: "👨‍💪", bg: "from-blue-400 to-blue-600" },
            { key: "female", label: t.onboarding.genderFemale, emoji: "👩‍🦰", bg: "from-pink-400 to-rose-500" },
          ].map((g) => {
            const selected = data.gender === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => onChange("gender", g.key)}
                className={cn(
                  "rounded-2xl overflow-hidden transition-all duration-300",
                  selected ? "scale-[1.03] shadow-lg" : "hover:scale-[1.01]"
                )}
              >
                <div className={cn(
                  "bg-gradient-to-b p-5 flex flex-col items-center gap-2 text-white",
                  selected ? g.bg : "from-muted to-muted/80"
                )}>
                  <span className="text-4xl">{g.emoji}</span>
                  <span className={cn("font-semibold", !selected && "text-foreground")}>{g.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Measurements */}
      <div>
        <p className="text-sm font-semibold mb-3">{t.onboarding.measurements}</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "age", label: t.onboarding.age, unit: t.onboarding.ageUnit, placeholder: "25" },
            { key: "heightCm", label: t.onboarding.height, unit: t.common.cm, placeholder: "170" },
            { key: "weightKg", label: t.onboarding.weight, unit: t.common.kg, placeholder: "70" },
          ].map((f) => (
            <div key={f.key} className="bg-card border border-border rounded-2xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-2">{f.label}</p>
              <Input
                type="number"
                value={(data as any)[f.key]}
                onChange={(e) => onChange(f.key as keyof FormData, e.target.value)}
                className="text-center text-lg font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                placeholder={f.placeholder}
              />
              <p className="text-xs text-muted-foreground mt-1">{f.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 3: Activity & Target ─────────────────────────────────────────────────
function StepTarget({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  const t = useT();
  const activities = [
    { key: "hareketsiz", label: t.onboarding.actSedentary, desc: t.onboarding.actSedentaryDesc, emoji: "🪑", kcal: "×1.2", color: "text-slate-500" },
    { key: "az_aktif", label: t.onboarding.actLight, desc: t.onboarding.actLightDesc, emoji: "🚶", kcal: "×1.375", color: "text-blue-500" },
    { key: "orta", label: t.onboarding.actModerate, desc: t.onboarding.actModerateDesc, emoji: "🏃", kcal: "×1.55", color: "text-emerald-500" },
    { key: "cok_aktif", label: t.onboarding.actActive, desc: t.onboarding.actActiveDesc, emoji: "🏋️", kcal: "×1.725", color: "text-orange-500" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-2xl p-4 flex gap-3 items-start">
        <span className="text-2xl">🎯</span>
        <div>
          <p className="text-sm font-semibold mb-2">{t.onboarding.targetWeight}</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={data.targetWeightKg}
              onChange={(e) => onChange("targetWeightKg", e.target.value)}
              className="w-24 rounded-xl text-center text-lg font-bold"
              placeholder="65"
            />
            <span className="text-muted-foreground font-medium">kg</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-3">{t.onboarding.activityLevel}</p>
        <div className="space-y-2">
          {activities.map((a) => {
            const selected = data.activityLevel === a.key;
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => onChange("activityLevel", a.key)}
                className={cn(
                  "w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all duration-200",
                  selected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:bg-accent"
                )}
              >
                <span className="text-2xl">{a.emoji}</span>
                <div className="flex-1">
                  <p className={cn("text-sm font-semibold", selected && "text-primary")}>{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <span className={cn("text-xs font-mono font-bold shrink-0", selected ? "text-primary" : a.color)}>
                  {a.kcal}
                </span>
                {selected && <Check className="h-4 w-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl px-4 py-3 flex gap-2">
        <span>⚡</span>
        <p className="text-xs text-amber-800 dark:text-amber-300">{t.onboarding.activityTip}</p>
      </div>
    </div>
  );
}

// ─── STEP 4: Diet ─────────────────────────────────────────────────────────────
function StepDiet({ data, onChange }: { data: FormData; onChange: (k: keyof FormData, v: any) => void }) {
  const t = useT();
  const diets: { key: DietType; label: string; emoji: string; desc: string }[] = [
    { key: "normal", label: t.onboarding.dietNormal, emoji: "🍽️", desc: t.onboarding.dietNormalDesc },
    { key: "vegan", label: t.onboarding.dietVegan, emoji: "🌱", desc: t.onboarding.dietVeganDesc },
    { key: "vejetaryen", label: t.onboarding.dietVegetarian, emoji: "🥗", desc: t.onboarding.dietVegetarianDesc },
    { key: "keto", label: t.onboarding.dietKeto, emoji: "🥑", desc: t.onboarding.dietKetoDesc },
    { key: "paleo", label: t.onboarding.dietPaleo, emoji: "🍖", desc: t.onboarding.dietPaleoDesc },
    { key: "glutensiz", label: t.onboarding.dietGlutenFree, emoji: "🌾", desc: t.onboarding.dietGlutenFreeDesc },
    { key: "helal", label: t.onboarding.dietHalal, emoji: "☪️", desc: t.onboarding.dietHalalDesc },
  ];

  const allergyOptions = [
    { label: "Gluten", emoji: "🌾" },
    { label: "Laktoz", emoji: "🥛" },
    { label: "Yumurta", emoji: "🥚" },
    { label: "Fındık", emoji: "🥜" },
    { label: "Deniz ürünleri", emoji: "🦐" },
    { label: "Balık", emoji: "🐟" },
    { label: "Soya", emoji: "🫘" },
    { label: "Susam", emoji: "🌿" },
  ];

  function toggleAllergy(a: string) {
    const cur = data.allergies;
    onChange("allergies", cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold mb-3">{t.onboarding.dietStyle}</p>
        <div className="grid grid-cols-2 gap-2">
          {diets.map((d) => {
            const selected = data.dietType === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => onChange("dietType", d.key)}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-2xl border-2 text-left transition-all duration-200",
                  selected
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-card hover:bg-accent"
                )}
              >
                <span className="text-2xl">{d.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold truncate", selected && "text-primary")}>{d.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{d.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <p className="text-sm font-semibold">{t.onboarding.allergies}</p>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{t.common.optional}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {allergyOptions.map((a) => {
            const selected = data.allergies.includes(a.label);
            return (
              <button
                key={a.label}
                type="button"
                onClick={() => toggleAllergy(a.label)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all",
                  selected
                    ? "border-destructive bg-destructive/10 text-destructive"
                    : "border-border bg-card text-muted-foreground hover:border-foreground"
                )}
              >
                <span>{a.emoji}</span>
                {a.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 5: Summary ──────────────────────────────────────────────────────────
function StepSummary({ data }: { data: FormData }) {
  const t = useT();
  const macros = calcMacros(data);
  if (!macros) return null;

  const goalEmoji: Record<GoalType, string> = { ver: "🔥", kor: "⚡", al: "💪" };
  const goalLabel: Record<GoalType, string> = {
    ver: t.onboarding.goalLose,
    kor: t.onboarding.goalKeep,
    al: t.onboarding.goalGain,
  };
  const actLabel: Record<ActivityLevel, string> = {
    hareketsiz: `${t.onboarding.actSedentary} 🪑`,
    az_aktif: `${t.onboarding.actLight} 🚶`,
    orta: `${t.onboarding.actModerate} 🏃`,
    cok_aktif: `${t.onboarding.actActive} 🏋️`,
  };

  const macroItems = [
    { label: t.onboarding.protein, value: macros.protein, unit: "g", emoji: "🥩", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40", bar: "bg-blue-500", pct: 25 },
    { label: t.onboarding.carbs, value: macros.carbs, unit: "g", emoji: "🍚", color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40", bar: "bg-amber-500", pct: 45 },
    { label: t.onboarding.fat, value: macros.fat, unit: "g", emoji: "🫒", color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/40", bar: "bg-rose-500", pct: 30 },
  ];

  const tips = [t.onboarding.tip1, t.onboarding.tip2, t.onboarding.tip3, t.onboarding.tip4];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="space-y-4">
      {/* Big calorie display */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-orange-600 rounded-3xl p-6 text-white text-center">
        <div className="absolute top-2 right-3 text-4xl opacity-20 select-none">🔥</div>
        <div className="absolute bottom-2 left-3 text-4xl opacity-20 select-none">💪</div>
        <p className="text-sm font-medium text-white/80 mb-1">{t.onboarding.dailyCalorie}</p>
        <p className="text-6xl font-black tracking-tight">{macros.calories}</p>
        <p className="text-sm text-white/80 mt-1">{t.onboarding.perDay}</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
          {goalEmoji[data.goalType!]} {goalLabel[data.goalType!]}
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-2">
        {macroItems.map((m) => (
          <div key={m.label} className={cn("rounded-2xl p-3 text-center", m.bg)}>
            <p className="text-xl mb-0.5">{m.emoji}</p>
            <p className={cn("text-xl font-black", m.color)}>{m.value}<span className="text-xs font-normal">{m.unit}</span></p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <div className="mt-2 h-1 bg-black/10 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full", m.bar)} style={{ width: `${m.pct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-0.5">%{m.pct}</p>
          </div>
        ))}
      </div>

      {/* Profile summary */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-2.5 bg-muted/50 border-b border-border">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.onboarding.profileSummary}</p>
        </div>
        <div className="px-4 py-3 space-y-2">
          {[
            { label: t.onboarding.activity, value: actLabel[data.activityLevel!] },
            { label: t.onboarding.targetWeight, value: `${data.targetWeightKg} kg` },
            { label: t.onboarding.dietLabel, value: data.dietType.charAt(0).toUpperCase() + data.dietType.slice(1) },
            ...(data.allergies.length > 0 ? [{ label: t.onboarding.allergies, value: data.allergies.join(", ") }] : []),
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-right max-w-[60%]">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl px-4 py-3 flex gap-2 items-start">
        <span className="text-base shrink-0">💡</span>
        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">{tip}</p>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function OnboardingClient() {
  const t = useT();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<FormData>({
    goalType: null,
    gender: null,
    age: "",
    heightCm: "",
    weightKg: "",
    targetWeightKg: "",
    activityLevel: null,
    dietType: "normal",
    allergies: [],
  });

  const STEPS = [
    { title: t.onboarding.step1Title, subtitle: t.onboarding.step1Sub },
    { title: t.onboarding.step2Title, subtitle: t.onboarding.step2Sub },
    { title: t.onboarding.step3Title, subtitle: t.onboarding.step3Sub },
    { title: t.onboarding.step4Title, subtitle: t.onboarding.step4Sub },
    { title: t.onboarding.step5Title, subtitle: t.onboarding.step5Sub },
  ];

  function update(key: keyof FormData, value: any) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function canAdvance() {
    if (step === 0) return data.goalType !== null;
    if (step === 1) return data.gender !== null && !!data.age && !!data.heightCm && !!data.weightKg;
    if (step === 2) return !!data.targetWeightKg && data.activityLevel !== null;
    return true;
  }

  function handleGoalSelect(v: GoalType) {
    update("goalType", v);
    setTimeout(() => setStep(1), 350);
  }

  async function handleFinish() {
    const macros = calcMacros(data);
    if (!macros) { toast.error(t.onboarding.fillAll); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: data.gender,
          age: parseInt(data.age),
          heightCm: parseFloat(data.heightCm),
          weightKg: parseFloat(data.weightKg),
          targetWeightKg: parseFloat(data.targetWeightKg),
          goalType: data.goalType,
          activityLevel: data.activityLevel,
          dietType: data.dietType,
          allergies: data.allergies,
          dailyCalorieGoal: macros.calories,
          proteinGoalG: macros.protein,
          carbGoalG: macros.carbs,
          fatGoalG: macros.fat,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(t.onboarding.created);
      router.push("/dashboard");
    } catch (e: any) {
      toast.error(e.message || t.common.error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto relative overflow-hidden">
      {/* Subtle food photo background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=800&q=60"
          alt=""
          aria-hidden
          className="w-full h-full object-cover opacity-5"
        />
      </div>
      {/* Header */}
      <div className="px-5 pt-8 pb-4 shrink-0 relative z-10">
        <div className="flex items-center gap-3 mb-7">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="text-xl">🥗</span>
          </div>
          <div>
            <span className="font-black text-lg">MunchLens</span>
            <p className="text-[10px] text-muted-foreground -mt-0.5">{t.onboarding.brandTagline}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-4">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  i < step ? "bg-primary w-full" : i === step ? "bg-primary w-1/2" : "w-0"
                )}
              />
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground font-medium">{t.common.step} {step + 1} {t.common.of} {STEPS.length}</p>
        <h1 className="text-2xl font-black mt-0.5">{STEPS[step].title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{STEPS[step].subtitle}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 relative z-10">
        {step === 0 && <StepGoal value={data.goalType} onChange={handleGoalSelect} />}
        {step === 1 && <StepPersonal data={data} onChange={update} />}
        {step === 2 && <StepTarget data={data} onChange={update} />}
        {step === 3 && <StepDiet data={data} onChange={update} />}
        {step === 4 && <StepSummary data={data} />}
      </div>

      {/* Footer nav */}
      {step > 0 && (
        <div className="px-5 py-4 border-t border-border bg-background/80 backdrop-blur-sm flex gap-3 shrink-0 relative z-10">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-xl h-12 px-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          {step < 4 ? (
            <Button
              className="flex-1 rounded-xl h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 shadow-md shadow-primary/25 font-semibold"
              disabled={!canAdvance()}
              onClick={() => setStep((s) => s + 1)}
            >
              {t.common.continue} <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          ) : (
            <Button
              className="flex-1 rounded-xl h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-500/90 hover:to-teal-600/90 shadow-md shadow-emerald-500/25 font-semibold text-white"
              disabled={submitting}
              onClick={handleFinish}
            >
              {submitting ? t.common.saving : t.onboarding.start}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
