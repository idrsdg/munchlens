"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Users } from "lucide-react";
import { toast } from "sonner";

export default function ProfilReferral() {
  const [code, setCode] = useState<string | null>(null);
  const [invitedCount, setInvitedCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referral")
      .then((r) => r.json())
      .then((d) => {
        if (d.code) {
          setCode(d.code);
          setInvitedCount(d.invitedCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  async function copyCode() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Kod kopyalandı!");
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareWhatsApp() {
    if (!code) return;
    const text = `MunchLens ile sağlıklı beslenmeyi takip ediyorum! Ücretsiz dene: ${window.location.origin}/giris?ref=${code}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  async function shareTwitter() {
    if (!code) return;
    const text = `MunchLens ile fotoğrafla kalori takibi yapıyorum 🍽️ Referral kodumla ücretsiz başla: ${code}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  }

  if (!code) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4 text-orange-500" />
          Arkadaşını Davet Et
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-2">Referral kodun</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-xl px-4 py-2.5 font-mono font-bold text-primary tracking-widest text-sm">
              {code}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyCode}
              className="rounded-xl gap-1.5 min-w-[80px]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Kopyalandı
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Kopyala
                </>
              )}
            </Button>
          </div>
        </div>

        {invitedCount > 0 && (
          <p className="text-xs text-muted-foreground">
            Şimdiye kadar <span className="font-semibold text-foreground">{invitedCount} kişi</span> davet ettin 🎉
          </p>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareWhatsApp}
            className="rounded-xl gap-1.5 flex-1"
          >
            <Share2 className="h-3.5 w-3.5" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={shareTwitter}
            className="rounded-xl gap-1.5 flex-1"
          >
            <Share2 className="h-3.5 w-3.5" />
            X / Twitter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
