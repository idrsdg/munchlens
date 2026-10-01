import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { name, email, password, referralCode } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre zorunlu" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Şifre en az 6 karakter olmalı" }, { status: 400 });
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    return NextResponse.json({ error: "Bu e-posta zaten kayıtlı" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);

  const displayName = name || email.split("@")[0];

  // Validate referral code if provided
  let referrerId: string | undefined;
  if (referralCode) {
    const [referrer] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.referralCode, (referralCode as string).toUpperCase()));
    referrerId = referrer?.id;
  }

  await db.insert(users).values({
    email,
    name: displayName,
    password: hashed,
    ...(referrerId ? { referredBy: referrerId } : {}),
  });

  // Fire-and-forget welcome email
  sendWelcomeEmail(email, displayName);

  return NextResponse.json({ success: true });
}
