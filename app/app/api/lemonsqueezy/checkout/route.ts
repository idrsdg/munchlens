import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutUrl, PLANS } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan } = await req.json();
  const variantId =
    plan === "yearly" ? PLANS.PRO_YEARLY.variantId : PLANS.PRO_MONTHLY.variantId;

  const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL!;

  const url = await createCheckoutUrl(
    variantId,
    session.user.id,
    session.user.email!,
    `${origin}/profil?success=true`,
    `${origin}/profil?canceled=true`
  );

  return NextResponse.json({ url });
}
