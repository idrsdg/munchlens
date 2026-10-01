"use client";

import { useState } from "react";
import { Camera, Search, Barcode } from "lucide-react";
import FotografYukle from "@/components/fotograf-yukle/fotograf-yukle";
import YemekAra from "@/components/yemek-ara/yemek-ara";
import BarkodScanner from "@/components/barkod-scanner/barkod-scanner";
import { useRouter } from "next/navigation";

const MEAL_OPTIONS = [
  { value: "kahvalti", label: "☀️ Kahvaltı" },
  { value: "ogle", label: "🌤️ Öğle" },
  { value: "aksam", label: "🌙 Akşam" },
  { value: "ara_ogun", label: "🍎 Ara Öğün" },
];

type ModalType = "photo" | "search" | "barcode" | null;

export default function FotografPage() {
  const router = useRouter();
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedMeal, setSelectedMeal] = useState("ogle");
  const today = new Date().toISOString().split("T")[0];

  function onSuccess() {
    setModal(null);
    router.push("/dashboard");
  }

  return (
    <div className="px-4 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-bold">Yemek Ekle</h1>
        <p className="text-sm text-gray-500 mt-1">Hangi öğüne eklemek istiyorsun?</p>
      </div>

      {/* Öğün seçimi */}
      <div className="grid grid-cols-2 gap-2">
        {MEAL_OPTIONS.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setSelectedMeal(m.value)}
            className={`py-3 rounded-xl text-sm font-medium border-2 transition-all ${
              selectedMeal === m.value
                ? "border-orange-400 bg-orange-50 text-orange-600"
                : "border-gray-200 text-gray-600"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Ekleme yöntemleri */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => setModal("photo")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
            <Camera className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="font-medium">Fotoğrafla Ekle</p>
            <p className="text-xs text-gray-500 mt-0.5">Yapay zeka yemeği tanır ve kaloriyi hesaplar</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setModal("search")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Search className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="font-medium">Yemek Ara</p>
            <p className="text-xs text-gray-500 mt-0.5">İsmiyle ara, porsiyon seç</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setModal("barcode")}
          className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-green-300 transition-all text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <Barcode className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="font-medium">Barkod Tara</p>
            <p className="text-xs text-gray-500 mt-0.5">Paketli ürünler için kamera ile tara</p>
          </div>
        </button>
      </div>

      {/* Modallar */}
      {modal === "photo" && (
        <FotografYukle
          mealType={selectedMeal}
          date={today}
          onClose={() => setModal(null)}
          onSuccess={onSuccess}
        />
      )}
      {modal === "search" && (
        <YemekAra
          mealType={selectedMeal}
          date={today}
          onClose={() => setModal(null)}
          onSuccess={onSuccess}
        />
      )}
      {modal === "barcode" && (
        <BarkodScanner
          mealType={selectedMeal}
          date={today}
          onClose={() => setModal(null)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
}
