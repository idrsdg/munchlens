"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Settings, LogOut, CreditCard, Pencil, Flame, Target, Zap, ArrowRight } from "lucide-react";
import ProfilCheckoutButton from "./profil-checkout-button";
import ProfilEditSheet from "./profil-edit-sheet";
import ProfilReferral from "./profil-referral";
import ProfilPushToggle from "./profil-push-toggle";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";
import PageHeroBanner from "@/components/page-hero-banner";

interface Props {
  user: any;
  sub: any;
  session: { user?: { image?: string | null; name?: string | null; email?: string | null } | null };
  success?: string;
  canceled?: string;
}

export default function ProfilClient({ user, sub, session, success, canceled }: Props) {
  const t = useT();
  const [showEdit, setShowEdit] = useState(false);

  const isPro = user?.isPro;

  const GOAL_LABELS: Record<string, string> = {
    ver: t.profile.goalLose,
    kor: t.profile.goalKeep,
    al: t.profile.goalGain,
  };

  async function handleSignOut() {
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/giris" });
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 space-y-5 max-w-2xl mx-auto">
      <PageHeroBanner
        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80"
        alt="Healthy lifestyle"
        title={t.profile.title}
        subtitle={session?.user?.email ?? undefined}
        gradient="purple"
        height="sm"
      />
      {/* Quick actions row */}
      <div className="flex items-center justify-end -mt-2">
        <Button variant="outline" size="sm" onClick={() => setShowEdit(true)} className="gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          {t.profile.edit}
        </Button>
      </div>

      {/* Notifications */}
      {success && (
        <div className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm p-4 rounded-xl border border-green-200 dark:border-green-800 animate-in fade-in">
          🎉 {t.profile.proActivated}
        </div>
      )}
      {canceled && (
        <div className="bg-muted text-muted-foreground text-sm p-4 rounded-xl border border-border">
          {t.profile.paymentCanceled}
        </div>
      )}

      {/* User Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-5">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt={t.profile.title}
                className="w-16 h-16 rounded-full ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-3xl ring-2 ring-primary/20">
                {session?.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold">{user?.name || "–"}</p>
              <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                {isPro ? (
                  <Badge className="bg-primary text-white">
                    <Crown className="mr-1 h-3 w-3" /> {t.profile.pro}
                  </Badge>
                ) : (
                  <Badge variant="secondary">{t.profile.free}</Badge>
                )}
                {user?.dietType && user.dietType !== "normal" && (
                  <Badge variant="outline" className="text-xs capitalize">{user.dietType}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Body measurements */}
          {(user?.heightCm || user?.weightKg || user?.goalType) && (() => {
            const bmi = user.heightCm && user.weightKg
              ? +(user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1)
              : null;
            const bmiCategory = bmi
              ? bmi < 18.5 ? { label: t.profile.bmiUnder, color: "text-blue-500" }
              : bmi < 25   ? { label: t.profile.bmiNormal, color: "text-green-500" }
              : bmi < 30   ? { label: t.profile.bmiOver, color: "text-amber-500" }
              :              { label: t.profile.bmiObese, color: "text-red-500" }
              : null;
            return (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {user.heightCm && (
                    <div>
                      <p className="text-lg font-bold">{user.heightCm}cm</p>
                      <p className="text-xs text-muted-foreground">{t.profile.height}</p>
                    </div>
                  )}
                  {user.weightKg && (
                    <div>
                      <p className="text-lg font-bold">{user.weightKg}kg</p>
                      <p className="text-xs text-muted-foreground">{t.profile.weight}</p>
                    </div>
                  )}
                  {user.goalType && (
                    <div>
                      <p className="text-sm font-semibold">{GOAL_LABELS[user.goalType] || user.goalType}</p>
                      <p className="text-xs text-muted-foreground">{t.profile.goalLabel}</p>
                    </div>
                  )}
                </div>
                {bmi && bmiCategory && (
                  <div className="mt-3 flex items-center justify-between bg-muted/40 rounded-xl px-4 py-2.5">
                    <div>
                      <p className="text-xs text-muted-foreground">BMI</p>
                      <p className={`text-xl font-black ${bmiCategory.color}`}>{bmi}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${bmiCategory.color}`}>{bmiCategory.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">18.5 — 24.9 {t.profile.bmiIdeal}</p>
                    </div>
                    {/* BMI scale bar */}
                    <div className="absolute left-0 right-0 hidden" />
                  </div>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Pro upgrade */}
      {!isPro && (
        <Card className="border-orange-200 dark:border-orange-900 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-bold text-orange-800 dark:text-orange-300 text-lg">{t.profile.upgrade}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  {t.profile.upgradeDesc}
                </p>
                <p className="text-xs text-orange-500 mt-1 font-medium">✨ 7 {t.profile.streak}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                <Crown className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div className="flex gap-3">
              <ProfilCheckoutButton plan="monthly" label="$4.99/ay" />
              <ProfilCheckoutButton plan="yearly" label="$29.99/yıl — %50 indirim" variant="outline" />
            </div>
            <Link href="/fiyatlar" className="block text-center text-xs text-orange-500 mt-3 hover:underline">
              →
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pro active */}
      {isPro && sub && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-xl flex items-center justify-center">
                <Crown className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{t.profile.proActive}</p>
                {sub.currentPeriodEnd && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.profile.renewalDate} {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </p>
                )}
                {sub.cancelAtPeriodEnd && (
                  <p className="text-xs text-red-400 mt-0.5">{t.profile.cancelAtEnd}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goal progress bar */}
      {user?.weightKg && user?.targetWeightKg && user?.weightKg !== user?.targetWeightKg && (() => {
        const start = user.weightKg;
        const target = user.targetWeightKg;
        const diff = Math.abs(start - target);
        const pct = Math.min(100, 100); // We don't have start weight so show current vs target
        const remaining = Math.abs(start - target).toFixed(1);
        const isLosing = target < start;
        return (
          <Card className="border-border">
            <CardContent className="py-4 px-4">
              <div className="flex items-center justify-between mb-2">
                <Link href="/takip" className="text-sm font-semibold hover:text-primary transition-colors flex items-center gap-1">
                  {t.profile.goalProgress}
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <span className={`text-sm font-bold ${isLosing ? "text-blue-500" : "text-orange-500"}`}>
                  {remaining} {t.common.kg}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{start}kg</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isLosing ? "bg-blue-500" : "bg-orange-500"}`}
                    style={{ width: "35%" }}
                  />
                </div>
                <span>{target}kg</span>
              </div>
            </CardContent>
          </Card>
        );
      })()}

      {/* Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{t.profile.statsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950 rounded-xl flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-primary">{user?.currentStreak || 0}</p>
            <p className="text-xs text-muted-foreground">{t.profile.currentStreak}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-yellow-50 dark:bg-yellow-950 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-bold text-primary">{user?.longestStreak || 0}</p>
            <p className="text-xs text-muted-foreground">{t.profile.longestStreak}</p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 rounded-xl flex items-center justify-center">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-primary">{user?.dailyCalorieGoal || "–"}</p>
            <p className="text-xs text-muted-foreground">{t.profile.kcalGoal}</p>
          </div>
        </CardContent>
      </Card>

      {/* Referral */}
      <ProfilReferral />

      {/* Push notifications toggle */}
      <ProfilPushToggle />

      {/* Menu */}
      <Card>
        <CardContent className="py-1 divide-y divide-border">
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-3 w-full py-3.5 text-sm text-left hover:text-primary transition-colors"
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            {t.profile.settings}
          </button>
          {isPro && (
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full py-3.5 text-sm text-left text-muted-foreground hover:text-foreground transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              {t.profile.manageSubscription}
            </a>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full py-3.5 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t.profile.signout}
          </button>
        </CardContent>
      </Card>

      {/* Edit Sheet */}
      <ProfilEditSheet
        open={showEdit}
        onClose={() => setShowEdit(false)}
        user={user || {}}
      />
    </div>
  );
}
