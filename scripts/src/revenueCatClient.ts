import { createClient } from "@replit/revenuecat-sdk/client";

export async function getUncachableRevenueCatClient() {
  const apiKey = process.env.REVENUECAT_API_KEY;
  if (!apiKey) {
    throw new Error(
      "[RevenueCat] REVENUECAT_API_KEY is not set.\n" +
      "Connect the RevenueCat integration in Replit, or set this env var manually with your RevenueCat secret API key.",
    );
  }
  return createClient({
    baseUrl: "https://api.revenuecat.com/v2",
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}
