"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useT } from "@/lib/i18n/context";

interface Props {
  open: boolean;
  onClose: () => void;
  user: {
    name?: string | null;
    age?: number | null;
    heightCm?: number | null;
    weightKg?: number | null;
    targetWeightKg?: number | null;
    goalType?: string | null;
    activityLevel?: string | null;
    dailyCalorieGoal?: number | null;
    proteinGoalG?: number | null;
    carbGoalG?: number | null;
    fatGoalG?: number | null;
    dietType?: string | null;
  };
}

export default function ProfilEditSheet({ open, onClose, user }: Props) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name ?? "",
    age: user.age?.toString() ?? "",
    heightCm: user.heightCm?.toString() ?? "",
    weightKg: user.weightKg?.toString() ?? "",
    targetWeightKg: user.targetWeightKg?.toString() ?? "",
    goalType: user.goalType ?? "kor",
    activityLevel: user.activityLevel ?? "orta",
    dailyCalorieGoal: user.dailyCalorieGoal?.toString() ?? "",
    proteinGoalG: user.proteinGoalG?.toString() ?? "",
    carbGoalG: user.carbGoalG?.toString() ?? "",
    fatGoalG: user.fatGoalG?.toString() ?? "",
    dietType: user.dietType ?? "normal",
  });

  function set(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/kullanici", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name || undefined,
          age: form.age ? parseInt(form.age) : undefined,
          heightCm: form.heightCm ? parseFloat(form.heightCm) : undefined,
          weightKg: form.weightKg ? parseFloat(form.weightKg) : undefined,
          targetWeightKg: form.targetWeightKg ? parseFloat(form.targetWeightKg) : undefined,
          goalType: form.goalType,
          activityLevel: form.activityLevel,
          dailyCalorieGoal: form.dailyCalorieGoal ? parseInt(form.dailyCalorieGoal) : undefined,
          proteinGoalG: form.proteinGoalG ? parseInt(form.proteinGoalG) : undefined,
          carbGoalG: form.carbGoalG ? parseInt(form.carbGoalG) : undefined,
          fatGoalG: form.fatGoalG ? parseInt(form.fatGoalG) : undefined,
          dietType: form.dietType,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success(t.profile.saveSuccess);
      onClose();
      window.location.reload();
    } catch {
      toast.error(t.profile.saveFailed);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t.profile.editTitle}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4 pb-8">
          {/* Basic info */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.profile.basicInfo}</p>
            <div>
              <Label>{t.profile.name}</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t.profile.name} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.profile.age}</Label>
                <Input type="number" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="25" />
              </div>
              <div>
                <Label>{t.profile.height} (cm)</Label>
                <Input type="number" value={form.heightCm} onChange={(e) => set("heightCm", e.target.value)} placeholder="170" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{t.profile.currentWeight}</Label>
                <Input type="number" value={form.weightKg} onChange={(e) => set("weightKg", e.target.value)} placeholder="70" />
              </div>
              <div>
                <Label>{t.profile.targetWeightLabel}</Label>
                <Input type="number" value={form.targetWeightKg} onChange={(e) => set("targetWeightKg", e.target.value)} placeholder="65" />
              </div>
            </div>
          </div>

          {/* Goal & activity */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.profile.goalActivity}</p>
            <div>
              <Label>{t.profile.goalLabel}</Label>
              <Select value={form.goalType} onValueChange={(v) => set("goalType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ver">{t.profile.goalLose}</SelectItem>
                  <SelectItem value="kor">{t.profile.goalKeep}</SelectItem>
                  <SelectItem value="al">{t.profile.goalGain}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.profile.activityLabel}</Label>
              <Select value={form.activityLevel} onValueChange={(v) => set("activityLevel", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hareketsiz">{t.profile.actSedentary}</SelectItem>
                  <SelectItem value="az_aktif">{t.profile.actLight}</SelectItem>
                  <SelectItem value="orta">{t.profile.actModerate}</SelectItem>
                  <SelectItem value="cok_aktif">{t.profile.actActive}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t.profile.dietLabel}</Label>
              <Select value={form.dietType} onValueChange={(v) => set("dietType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">{t.onboarding.dietNormal}</SelectItem>
                  <SelectItem value="vegan">{t.onboarding.dietVegan}</SelectItem>
                  <SelectItem value="vejetaryen">{t.onboarding.dietVegetarian}</SelectItem>
                  <SelectItem value="keto">{t.onboarding.dietKeto}</SelectItem>
                  <SelectItem value="paleo">{t.onboarding.dietPaleo}</SelectItem>
                  <SelectItem value="glutensiz">{t.onboarding.dietGlutenFree}</SelectItem>
                  <SelectItem value="helal">{t.onboarding.dietHalal}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Daily goals */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t.profile.dailyGoals}</p>
            <div>
              <Label>{t.profile.calorieGoalLabel}</Label>
              <Input type="number" value={form.dailyCalorieGoal} onChange={(e) => set("dailyCalorieGoal", e.target.value)} placeholder="2000" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>{t.profile.proteinGoal} (g)</Label>
                <Input type="number" value={form.proteinGoalG} onChange={(e) => set("proteinGoalG", e.target.value)} placeholder="150" />
              </div>
              <div>
                <Label>{t.profile.carbGoal} (g)</Label>
                <Input type="number" value={form.carbGoalG} onChange={(e) => set("carbGoalG", e.target.value)} placeholder="250" />
              </div>
              <div>
                <Label>{t.profile.fatGoal} (g)</Label>
                <Input type="number" value={form.fatGoalG} onChange={(e) => set("fatGoalG", e.target.value)} placeholder="65" />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {t.common.save}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
