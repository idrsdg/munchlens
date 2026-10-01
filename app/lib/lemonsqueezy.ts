import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

export const PLANS = {
  PRO_MONTHLY: {
    variantId: process.env.LEMONSQUEEZY_PRO_MONTHLY_VARIANT_ID!,
    name: "Pro Aylık",
    price: 4.99,
    interval: "month" as const,
  },
  PRO_YEARLY: {
    variantId: process.env.LEMONSQUEEZY_PRO_YEARLY_VARIANT_ID!,
    name: "Pro Yıllık",
    price: 29.99,
    interval: "year" as const,
  },
} as const;

export async function createCheckoutUrl(
  variantId: string,
  userId: string,
  userEmail: string,
  successUrl: string,
  cancelUrl: string
) {
  const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: false,
    },
    checkoutData: {
      email: userEmail,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      redirectUrl: successUrl,
      receiptButtonText: "Panele Dön",
      receiptThankYouNote: "MunchLens Pro'ya hoş geldiniz! 🎉",
      enabledVariants: [parseInt(variantId)],
    },
  });

  if (error) throw new Error(error.message);
  return data!.data.attributes.url;
}

export { getSubscription };
