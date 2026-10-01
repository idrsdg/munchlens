"use client";

import { useState } from "react";
import { Check, Crown, Zap, Camera, BarChart2, BookOpen, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

function getIcon(feature: string) {
  const lower = feature.toLowerCase();
  if (lower.includes("photo") || lower.includes("foto")) return <Camera className="h-4 w-4 text-orange-500" />;
  if (lower.includes("recipe") || lower.includes("tarif") || lower.includes("recette") || lower.includes("receta")) return <BookOpen className="h-4 w-4 text-blue-500" />;
  if (lower.includes("plan") || lower.includes("analyt") || lower.includes("analiz") || lower.includes("analy")) return <BarChart2 className="h-4 w-4 text-purple-500" />;
  if (lower.includes("shop") || lower.includes("alisveris") || lower.includes("compra") || lower.includes("course")) return <ShoppingCart className="h-4 w-4 text-green-500" />;
  return <Zap className="h-4 w-4 text-primary" />;
}

export default function FiyatlarPage() {
  const t = useT();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);

  const freeFeatures = [
    t.pricing.freeFeature1, t.pricing.freeFeature2, t.pricing.freeFeature3,
    t.pricing.freeFeature4, t.pricing.freeFeature5, t.pricing.freeFeature6,
  ];

  const proFeatures = [
    t.pricing.proFeature1, t.pricing.proFeature2, t.pricing.proFeature3,
    t.pricing.proFeature4, t.pricing.proFeature5, t.pricing.proFeature6,
    t.pricing.proFeature7, t.pricing.proFeature8,
  ];

  async function handleCheckout(plan: "monthly" | "yearly") {
    setLoading(plan);
    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  const monthlyPrice = billingPeriod === "yearly" ? 2.50 : 4.99;
  const yearlySave = Math.round((1 - (2.50 * 12) / (4.99 * 12)) * 100);

  const trustItems = [
    { emoji: "🔒", title: t.pricing.trustSecure, desc: t.pricing.trustSecureDesc },
    { emoji: "↩️", title: t.pricing.trustCancel, desc: t.pricing.trustCancelDesc },
    { emoji: "💳", title: t.pricing.trustNoFee, desc: t.pricing.trustNoFeeDesc },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {t.pricing.backToDashboard}
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12 space-y-10">
        {/* Hero with photo */}
        <PageHeroBanner
          src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=1200&q=80"
          alt="Fresh healthy fruit"
          title={t.pricing.heroTitle}
          subtitle={t.pricing.heroDesc}
          badge={`👑 ${t.pricing.proTitle}`}
          gradient="orange"
          height="lg"
        />

        {/* Billing toggle */}
        <div className="flex justify-center">
          <div className="flex rounded-2xl border border-border bg-muted/30 p-1">
            {(["monthly", "yearly"] as const).map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setBillingPeriod(period)}
                className={cn(
                  "px-5 py-2 rounded-xl text-sm font-medium transition-all",
                  billingPeriod === period
                    ? "bg-card shadow-sm text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {period === "monthly" ? t.pricing.monthly : (
                  <span className="flex items-center gap-1.5">
                    {t.pricing.yearly}
                    <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-1.5 py-0.5 rounded-full font-semibold">
                      %{yearlySave} {t.pricing.discount}
                    </span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free plan */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t.pricing.freePlan}</p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground pb-1">{t.pricing.perMonth}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{t.pricing.freePlanSub}</p>
            </div>

            <Link href="/giris">
              <Button variant="outline" className="w-full rounded-xl h-11">
                {t.pricing.startFree}
              </Button>
            </Link>

            <div className="space-y-2.5">
              {freeFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro plan */}
          <div className="rounded-2xl border-2 border-primary bg-card p-6 space-y-5 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                {t.pricing.popular}
              </div>
            </div>

            {/* Shimmer bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none" />

            <div className="relative">
              <p className="text-sm text-primary font-semibold uppercase tracking-wider flex items-center gap-1">
                <Crown className="h-4 w-4" /> Pro
              </p>
              <div className="flex items-end gap-1 mt-1">
                <span className="text-4xl font-bold">${monthlyPrice}</span>
                <span className="text-muted-foreground pb-1">{t.pricing.perMonth}</span>
              </div>
              {billingPeriod === "yearly" ? (
                <p className="text-sm text-muted-foreground mt-1">{t.pricing.billedYearly}</p>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1 font-medium">
                  {t.pricing.switchYearlySave}
                </p>
              )}
            </div>

            <Button
              onClick={() => handleCheckout(billingPeriod)}
              disabled={!!loading}
              className="w-full bg-primary hover:bg-primary/90 rounded-xl h-11 relative font-semibold"
            >
              {loading === billingPeriod ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t.pricing.freeTrial
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              {t.pricing.trialNote}
            </p>

            <div className="space-y-2.5">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <div className="shrink-0">{getIcon(feature)}</div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid sm:grid-cols-3 gap-4 text-center">
          {trustItems.map(({ emoji, title, desc }) => (
            <div key={title} className="bg-muted/30 rounded-2xl p-5 space-y-1">
              <p className="text-2xl">{emoji}</p>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
