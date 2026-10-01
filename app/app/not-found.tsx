import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Utensils } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-950 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Utensils className="h-10 w-10 text-orange-500" />
        </div>
        <h1 className="text-6xl font-black text-orange-500 mb-2">404</h1>
        <h2 className="text-xl font-bold mb-3">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link href="/">
          <Button className="rounded-xl gap-2">
            <Home className="h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
