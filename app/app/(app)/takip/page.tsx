"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Minus, Scale, Plus, Loader2, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

interface WeightLog { id: string; date: string; weightKg: number; notes?: string; }
interface TakipData { logs: WeightLog[]; currentWeight: number | null; targetWeight: number | null; goalType: "ver" | "kor" | "al"; }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-bold text-primary">{payload[0].value} kg</p>
    </div>
  );
}

function StatCard({ label, value, unit, icon: Icon, color, bg }: any) {
  return (
    <div className={cn("rounded-2xl p-4 flex items-center gap-3", bg)}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-white/40 dark:bg-black/20", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-black">{value}<span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span></p>
      </div>
    </div>
  );
}

export default function TakipPage() {
  const t = useT();
  const [data, setData] = useState<TakipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/takip");
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { toast.error(t.tracking.failedLoad); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchData(); }, []);

  async function logWeight() {
    const kg = parseFloat(weight);
    if (!kg || kg < 10 || kg > 500) { toast.error(t.tracking.invalidWeight); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/takip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weightKg: kg, date: today, notes }),
      });
      if (!res.ok) throw new Error();
      toast.success(t.tracking.saved);
      setWeight(""); setNotes("");
      await fetchData();
    } catch { toast.error(t.tracking.failedSave); }
    finally { setSaving(false); }
  }

  const logs = data?.logs ?? [];
  const chartData = logs.slice(-30).map((l) => ({
    date: new Date(l.date).toLocaleDateString(t.dateLocale as any, { day: "numeric", month: "short" }),
    weight: l.weightKg,
  }));

  const latest = logs[logs.length - 1];
  const prev = logs[logs.length - 2];
  const diff = latest && prev ? latest.weightKg - prev.weightKg : null;
  const target = data?.targetWeight;
  const remaining = latest && target ? Math.abs(latest.weightKg - target) : null;

  const goalInfo = {
    ver: { label: t.tracking.goalLose, icon: TrendingDown, color: "text-blue-500" },
    kor: { label: t.tracking.goalKeep, icon: Minus,        color: "text-emerald-500" },
    al:  { label: t.tracking.goalGain, icon: TrendingUp,   color: "text-orange-500" },
  };
  const goal = goalInfo[data?.goalType ?? "kor"];
  const minWeight = Math.min(...logs.map((l) => l.weightKg), target ?? Infinity) - 2;
  const maxWeight = Math.max(...logs.map((l) => l.weightKg), target ?? 0) + 2;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto space-y-5">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80"
        alt="Fitness and healthy lifestyle"
        title={t.tracking.title}
        subtitle={t.tracking.subtitle}
        gradient="blue"
      />

      {loading && <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label={t.tracking.currentWeight} value={latest?.weightKg?.toFixed(1) ?? (data.currentWeight?.toFixed(1) ?? "—")} unit={t.common.kg} icon={Scale} color="text-primary" bg="bg-primary/10" />
            <StatCard label={t.tracking.targetWeight} value={target?.toFixed(1) ?? "—"} unit={t.common.kg} icon={Target} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-950/30" />
          </div>

          {latest && target && (
            <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
              <goal.icon className={cn("h-8 w-8 shrink-0", goal.color)} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{remaining?.toFixed(1)} {t.common.kg} {t.tracking.remaining}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{goal.label}</p>
              </div>
              {diff !== null && (
                <Badge variant="outline" className={cn("font-bold shrink-0",
                  diff < 0 ? "text-blue-600 border-blue-200" : diff > 0 ? "text-rose-600 border-rose-200" : "text-emerald-600 border-emerald-200")}>
                  {diff > 0 ? "+" : ""}{diff.toFixed(1)} {t.common.kg}
                </Badge>
              )}
            </div>
          )}

          {chartData.length > 1 ? (
            <div className="bg-card border border-border rounded-2xl p-4">
              <p className="text-sm font-semibold mb-4">{t.tracking.chartTitle}</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} interval="preserveStartEnd" />
                  <YAxis domain={[minWeight, maxWeight]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}kg`} />
                  <Tooltip content={<CustomTooltip />} />
                  {target && (
                    <ReferenceLine y={target} stroke="hsl(var(--primary))" strokeDasharray="5 5"
                      label={{ value: `${t.tracking.targetWeight} ${target}kg`, position: "insideTopRight", fontSize: 10, fill: "hsl(var(--primary))" }} />
                  )}
                  <Area type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#weightGrad)"
                    dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <p className="text-4xl mb-3">📈</p>
              <p className="text-sm font-semibold">{t.tracking.noChart}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.tracking.noChartDesc}</p>
            </div>
          )}

          <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-2xl p-4 space-y-3">
            <p className="text-sm font-bold flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />{t.tracking.logWeight}
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && logWeight()}
                  placeholder={t.tracking.weightPlaceholder}
                  className="rounded-xl pr-10 text-lg font-bold text-center" min={10} max={500} step={0.1} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{t.common.kg}</span>
              </div>
              <Button onClick={logWeight} disabled={saving || !weight} className="rounded-xl bg-primary hover:bg-primary/90 px-5">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : t.tracking.save}
              </Button>
            </div>
            <Input placeholder={t.tracking.notesPlaceholder} value={notes} onChange={(e) => setNotes(e.target.value)} className="rounded-xl text-sm" />
          </div>

          {logs.length > 0 && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-sm font-semibold">{t.tracking.historyTitle}</p>
              </div>
              <div className="divide-y divide-border">
                {[...logs].reverse().slice(0, 10).map((log, i) => {
                  const prev2 = [...logs].reverse()[i + 1];
                  const d = prev2 ? log.weightKg - prev2.weightKg : null;
                  return (
                    <div key={log.id} className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(log.date).toLocaleDateString(t.dateLocale as any, { weekday: "short", day: "numeric", month: "short" })}
                        </p>
                        {log.notes && <p className="text-xs text-muted-foreground mt-0.5">{log.notes}</p>}
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="font-bold">{log.weightKg.toFixed(1)} {t.common.kg}</span>
                        {d !== null && (
                          <span className={cn("text-xs font-medium", d < 0 ? "text-blue-500" : d > 0 ? "text-rose-500" : "text-emerald-500")}>
                            {d > 0 ? "+" : ""}{d.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {logs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-4xl mb-3">⚖️</p>
              <p className="text-sm font-semibold">{t.tracking.noLogs}</p>
              <p className="text-xs text-muted-foreground mt-1">{t.tracking.noLogsDesc}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
