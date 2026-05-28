import React, { createContext, useContext, useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";
import type { PurchasesOfferings, CustomerInfo } from "react-native-purchases";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { useAuth } from "@/lib/auth";

const REVENUECAT_TEST_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

export const ENTITLEMENT_PREMIUM = "premium";

let rcInitialized = false;

function getApiKey(): string | null {
  if (!REVENUECAT_TEST_API_KEY && !REVENUECAT_IOS_API_KEY && !REVENUECAT_ANDROID_API_KEY) {
    return null;
  }
  if (__DEV__ || Platform.OS === "web" || Constants.executionEnvironment === "storeClient") {
    return REVENUECAT_TEST_API_KEY ?? null;
  }
  if (Platform.OS === "ios") return REVENUECAT_IOS_API_KEY ?? null;
  if (Platform.OS === "android") return REVENUECAT_ANDROID_API_KEY ?? null;
  return REVENUECAT_TEST_API_KEY ?? null;
}

export function initializeRevenueCat() {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.log("[RevenueCat] No API key configured — subscription features disabled until connected.");
    return;
  }
  try {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey });
    rcInitialized = true;
    console.log("[RevenueCat] Initialized");
  } catch (err) {
    console.warn("[RevenueCat] Initialization failed:", err);
  }
}

function useSubscriptionContext() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!rcInitialized) return;
    if (user?.id) {
      Purchases.logIn(user.id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["revenuecat", "customer-info"] });
        })
        .catch((err) => console.warn("[RevenueCat] logIn failed:", err));
    } else {
      Purchases.logOut()
        .catch((err) => console.warn("[RevenueCat] logOut failed:", err));
    }
  }, [user?.id, queryClient]);

  const customerInfoQuery = useQuery<CustomerInfo | null>({
    queryKey: ["revenuecat", "customer-info"],
    queryFn: async () => {
      if (!rcInitialized) return null;
      return Purchases.getCustomerInfo();
    },
    staleTime: 60 * 1000,
  });

  const offeringsQuery = useQuery<PurchasesOfferings | null>({
    queryKey: ["revenuecat", "offerings"],
    queryFn: async () => {
      if (!rcInitialized) return null;
      return Purchases.getOfferings();
    },
    staleTime: 300 * 1000,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: Parameters<typeof Purchases.purchasePackage>[0]) => {
      if (!rcInitialized) throw new Error("RevenueCat not configured");
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    },
    onSuccess: () => {
      customerInfoQuery.refetch();
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      if (!rcInitialized) throw new Error("RevenueCat not configured");
      return Purchases.restorePurchases();
    },
    onSuccess: () => {
      customerInfoQuery.refetch();
    },
  });

  const isPremium =
    !rcInitialized ||
    (customerInfoQuery.data != null &&
      customerInfoQuery.data.entitlements.active[ENTITLEMENT_PREMIUM] !== undefined);

  return {
    customerInfo: customerInfoQuery.data ?? null,
    offerings: offeringsQuery.data ?? null,
    isPremium,
    isRcConfigured: rcInitialized,
    isLoading: customerInfoQuery.isLoading || offeringsQuery.isLoading,
    purchase: purchaseMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
  };
}

type SubscriptionContextValue = ReturnType<typeof useSubscriptionContext>;
const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useSubscriptionContext();
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within a SubscriptionProvider");
  return ctx;
}
