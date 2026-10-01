"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Camera, X, Check, Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n/context";

interface DetectedFood {
  name: string;
  portionDescription: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
}

interface Props {
  mealType: string;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FotografYukle({ mealType, date, onClose, onSuccess }: Props) {
  const t = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [detected, setDetected] = useState<DetectedFood[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const MEAL_LABELS: Record<string, string> = {
    kahvalti: t.dashboard.breakfast,
    ogle: t.dashboard.lunch,
    aksam: t.dashboard.dinner,
    ara_ogun: t.dashboard.snack,
  };

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setDetected([]);
    };
    reader.readAsDataURL(file);
  }

  async function analyzePhoto() {
    if (!preview) return;
    setAnalyzing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("base64", preview);

      const res = await fetch("/api/ai/fotograf-analiz", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t.photo.analysisFailed);
        return;
      }

      setDetected(data.foods || []);
      setSelected(new Set(data.foods.map((_: any, i: number) => i)));
    } catch {
      setError(t.photo.connectionError);
    } finally {
      setAnalyzing(false);
    }
  }

  async function saveSelected() {
    setSaving(true);
    const toSave = detected.filter((_, i) => selected.has(i));

    try {
      await Promise.all(
        toSave.map((food) =>
          fetch("/api/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date,
              mealType,
              foodName: food.name,
              portionGrams: food.portionGrams,
              portionDescription: food.portionDescription,
              calories: food.calories,
              proteinG: food.protein,
              carbG: food.carbs,
              fatG: food.fat,
              source: "photo",
              aiConfidence: food.confidence,
            }),
          })
        )
      );
      onSuccess();
    } catch {
      setError(t.photo.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t.photo.title} — {MEAL_LABELS[mealType]}</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Photo selector */}
          {!preview ? (
            <div
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-orange-300 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              <Camera className="mx-auto h-10 w-10 text-gray-400 mb-3" />
              <p className="font-medium text-gray-700">{t.photo.selectPhoto}</p>
              <p className="text-sm text-gray-400 mt-1">{t.photo.fromGallery}</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt={t.photo.title}
                className="w-full rounded-xl object-cover max-h-48"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => { setPreview(null); setDetected([]); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Analyze button */}
          {preview && detected.length === 0 && (
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={analyzePhoto}
              disabled={analyzing}
            >
              {analyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.photo.analyzing}
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  {t.photo.analyzeBtn}
                </>
              )}
            </Button>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          {/* Detected foods */}
          {detected.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t.photo.detected}</h3>
                <span className="text-xs text-gray-400">{t.photo.tapToToggle}</span>
              </div>

              {detected.map((food, i) => (
                <Card
                  key={i}
                  className={`cursor-pointer transition-all ${
                    selected.has(i) ? "border-orange-400 bg-orange-50" : "opacity-60"
                  }`}
                  onClick={() => {
                    const next = new Set(selected);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    setSelected(next);
                  }}
                >
                  <CardContent className="py-3 px-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{food.name}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${food.confidence > 0.8 ? "border-green-400 text-green-600" : "border-yellow-400 text-yellow-600"}`}
                          >
                            {Math.round(food.confidence * 100)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{food.portionDescription}</p>
                        <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                          <span>P: {food.protein}g</span>
                          <span>K: {food.carbs}g</span>
                          <span>Y: {food.fat}g</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-orange-500">{Math.round(food.calories)}</span>
                        <span className="text-xs text-gray-400 block">kcal</span>
                        {selected.has(i) ? (
                          <Check className="ml-auto mt-1 h-4 w-4 text-orange-500" />
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Total */}
              <div className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {selected.size} {t.photo.selectedCount}
                </span>
                <span className="font-bold">
                  {Math.round(
                    detected.filter((_, i) => selected.has(i)).reduce((s, f) => s + f.calories, 0)
                  )} kcal
                </span>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={selected.size === 0 || saving}
                onClick={saveSelected}
              >
                {saving ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.common.saving}</>
                ) : (
                  <><Check className="mr-2 h-4 w-4" /> {selected.size} {t.photo.saveSelected}</>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
