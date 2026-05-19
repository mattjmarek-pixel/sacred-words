import React, { createContext, useContext } from "react";
import type { PurchasesOfferings, CustomerInfo } from "react-native-purchases";

export const ENTITLEMENT_PREMIUM = "premium";

export function initializeRevenueCat() {
  console.log("[RevenueCat] Web platform — subscription features not available.");
}

type SubscriptionContextValue = {
  customerInfo: CustomerInfo | null;
  offerings: PurchasesOfferings | null;
  isPremium: boolean;
  isRcConfigured: boolean;
  isLoading: boolean;
  purchase: (...args: unknown[]) => Promise<void>;
  restore: () => Promise<void>;
  isPurchasing: boolean;
  isRestoring: boolean;
};

const stub: SubscriptionContextValue = {
  customerInfo: null,
  offerings: null,
  isPremium: false,
  isRcConfigured: false,
  isLoading: false,
  purchase: () => Promise.resolve(),
  restore: () => Promise.resolve(),
  isPurchasing: false,
  isRestoring: false,
};

const SubscriptionContext = createContext<SubscriptionContextValue>(stub);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  return <SubscriptionContext.Provider value={stub}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionContextValue {
  return useContext(SubscriptionContext);
}
