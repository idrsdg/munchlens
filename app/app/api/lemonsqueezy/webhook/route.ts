import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendProActivatedEmail } from "@/lib/email";

function verifySignature(body: string, signature: string, secret: string): boolean {
  try {
    const hmac = crypto.createHmac("sha256", secret.trim());
    const digest = hmac.update(body).digest("hex");
    return digest === signature.trim();
  } catch {
    return false;
  }
}

function lsStatusToDb(lsStatus: string): string {
  if (lsStatus === "active") return "active";
  if (lsStatus === "trialing" || lsStatus === "on_trial") return "trialing";
  if (lsStatus === "cancelled" || lsStatus === "canceled") return "canceled";
  return "past_due";
}

function lsStatusIsActive(lsStatus: string): boolean {
  return lsStatus === "active" || lsStatus === "trialing" || lsStatus === "on_trial";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-signature") ?? "";

  if (!verifySignature(body, signature, process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: "Geçersiz imza" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const eventName: string = event.meta?.event_name;
  const userId: string = event.meta?.custom_data?.user_id ?? "";
  const attrs = event.data?.attributes ?? {};

  switch (eventName) {
    case "subscription_created": {
      if (!userId) break;

      const periodEnd = attrs.renews_at
        ? new Date(attrs.renews_at)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const periodStart = new Date(attrs.created_at ?? Date.now());
      const dbStatus = lsStatusToDb(attrs.status);

      await db
        .insert(subscriptions)
        .values({
          userId,
          lsCustomerId: String(attrs.customer_id),
          lsSubscriptionId: String(event.data.id),
          lsVariantId: String(attrs.variant_id),
          lsOrderId: String(attrs.order_id),
          status: dbStatus as any,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            lsSubscriptionId: String(event.data.id),
            lsVariantId: String(attrs.variant_id),
            lsOrderId: String(attrs.order_id),
            status: dbStatus as any,
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
          },
        });

      await db.update(users).set({ isPro: true }).where(eq(users.id, userId));

      const [updatedUser] = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, userId));
      if (updatedUser?.email) {
        sendProActivatedEmail(updatedUser.email, updatedUser.name || "Kullanıcı");
      }
      break;
    }

    case "subscription_updated": {
      const lsSubId = String(event.data.id);
      const dbStatus = lsStatusToDb(attrs.status);
      const isActive = lsStatusIsActive(attrs.status);
      const periodEnd = attrs.renews_at
        ? new Date(attrs.renews_at)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await db
        .update(subscriptions)
        .set({
          status: dbStatus as any,
          cancelAtPeriodEnd: !!attrs.ends_at,
          currentPeriodEnd: periodEnd,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.lsSubscriptionId, lsSubId));

      const [existingSub] = await db
        .select({ userId: subscriptions.userId })
        .from(subscriptions)
        .where(eq(subscriptions.lsSubscriptionId, lsSubId));

      if (existingSub) {
        await db.update(users).set({ isPro: isActive }).where(eq(users.id, existingSub.userId));
      }
      break;
    }

    case "subscription_cancelled": {
      const lsSubId = String(event.data.id);
      const periodEnd = attrs.ends_at ? new Date(attrs.ends_at) : new Date();

      await db
        .update(subscriptions)
        .set({
          status: "canceled" as any,
          cancelAtPeriodEnd: true,
          currentPeriodEnd: periodEnd,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.lsSubscriptionId, lsSubId));

      const [existingSub] = await db
        .select({ userId: subscriptions.userId })
        .from(subscriptions)
        .where(eq(subscriptions.lsSubscriptionId, lsSubId));

      if (existingSub) {
        await db.update(users).set({ isPro: false }).where(eq(users.id, existingSub.userId));
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
