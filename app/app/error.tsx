"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-950 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-3">Bir Hata Oluştu</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} className="rounded-xl gap-2">
            <RefreshCcw className="h-4 w-4" />
            Tekrar Dene
          </Button>
          <Link href="/">
            <Button variant="outline" className="rounded-xl gap-2">
              <Home className="h-4 w-4" />
              Ana Sayfa
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
