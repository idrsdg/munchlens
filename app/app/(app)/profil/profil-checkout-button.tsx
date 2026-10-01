"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  plan: "monthly" | "yearly";
  label: string;
  variant?: "default" | "outline";
}

export default function ProfilCheckoutButton({ plan, label, variant = "default" }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant={variant}
      className={variant === "default" ? "bg-orange-500 hover:bg-orange-600" : "border-orange-300 text-orange-600"}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </Button>
  );
}
