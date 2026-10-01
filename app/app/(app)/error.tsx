"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-lg font-bold mb-2">Bir Hata Oluştu</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Bu sayfa yüklenirken sorun oluştu. Tekrar deneyin.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="sm" className="rounded-xl gap-2">
            <RefreshCcw className="h-3.5 w-3.5" />
            Tekrar Dene
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="rounded-xl gap-2">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
