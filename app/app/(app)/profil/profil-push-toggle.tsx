"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, BellOff } from "lucide-react";
import { toast } from "sonner";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function ProfilPushToggle() {
  const [supported, setSupported] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window && VAPID_PUBLIC_KEY) {
      setSupported(true);
      // Check existing subscription
      navigator.serviceWorker.ready.then(async (sw) => {
        const sub = await sw.pushManager.getSubscription();
        setSubscribed(!!sub);
      });
      // Register SW
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }
  }, []);

  async function toggle() {
    if (!VAPID_PUBLIC_KEY) return;
    setLoading(true);

    try {
      const sw = await navigator.serviceWorker.ready;

      if (subscribed) {
        const sub = await sw.pushManager.getSubscription();
        if (sub) {
          await sub.unsubscribe();
          await fetch("/api/push/unsubscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          });
        }
        setSubscribed(false);
        toast.success("Bildirimler kapatıldı");
      } else {
        const sub = await sw.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });

        const json = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: sub.endpoint,
            keys: { p256dh: json.keys?.p256dh, auth: json.keys?.auth },
          }),
        });
        setSubscribed(true);
        toast.success("Bildirimler açıldı!");
      }
    } catch (err: any) {
      console.error("Push toggle error:", err);
      toast.error("Bildirim ayarı değiştirilemedi");
    } finally {
      setLoading(false);
    }
  }

  if (!supported) return null;

  return (
    <Card>
      <CardContent className="py-1">
        <button
          type="button"
          onClick={toggle}
          disabled={loading}
          className="flex items-center justify-between w-full py-3.5 text-sm"
        >
          <div className="flex items-center gap-3">
            {subscribed ? (
              <Bell className="h-4 w-4 text-orange-500" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{subscribed ? "Bildirimler Açık" : "Bildirimleri Aç"}</span>
          </div>
          <div
            className={`w-10 h-5 rounded-full transition-colors ${
              subscribed ? "bg-orange-500" : "bg-muted-foreground/30"
            } relative`}
          >
            <div
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                subscribed ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </button>
      </CardContent>
    </Card>
  );
}
