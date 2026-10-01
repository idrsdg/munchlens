import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

function generateReferralCode(name: string): string {
  const prefix = "MUNCH";
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${suffix}`;
}

// GET: Return or generate current user's referral code + invited count
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmanız gerekiyor" }, { status: 401 });
  }

  const userId = session.user.id;
  const [user] = await db
    .select({ referralCode: users.referralCode, name: users.name })
    .from(users)
    .where(eq(users.id, userId));

  let code = user?.referralCode;

  if (!code) {
    code = generateReferralCode(user?.name || "user");
    await db.update(users).set({ referralCode: code }).where(eq(users.id, userId));
  }

  // Count how many users were referred by this user
  const referred = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.referredBy, userId));

  return NextResponse.json({ code, invitedCount: referred.length });
}

// POST: Validate a referral code (called during signup)
export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Kod gerekli" }, { status: 400 });
  }

  const [referrer] = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.referralCode, code.toUpperCase()));

  if (!referrer) {
    return NextResponse.json({ valid: false, error: "Geçersiz referral kodu" });
  }

  return NextResponse.json({ valid: true, referrerId: referrer.id, referrerName: referrer.name });
}
