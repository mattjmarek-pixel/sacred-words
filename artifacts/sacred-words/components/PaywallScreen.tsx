import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useColors } from "@/hooks/useColors";
import { useSubscription } from "@/lib/revenuecat";

interface PaywallScreenProps {
  visible: boolean;
  onClose: () => void;
}

const BENEFITS = [
  { text: "Unlimited AI prayer generations" },
  { text: "Submit prayers to the community" },
  { text: "All 8 faith traditions, always" },
  { text: "Support Sacred Words" },
];

export function PaywallScreen({ visible, onClose }: PaywallScreenProps) {
  const colors = useColors();
  const {
    offerings,
    isPurchasing,
    isRestoring,
    purchase,
    restore,
    isRcConfigured,
    isPremium,
  } = useSubscription();

  const [error, setError] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [confirmingPurchase, setConfirmingPurchase] = useState(false);

  const currentOffering = offerings?.current;
  const monthlyPackage = currentOffering?.availablePackages[0] ?? null;
  const priceString = monthlyPackage?.product.priceString ?? null;

  const isAvailable = isRcConfigured && !!monthlyPackage;

  const handleClose = () => {
    setError(null);
    setRestored(false);
    setConfirmingPurchase(false);
    onClose();
  };

  const handleSubscribe = async () => {
    if (!monthlyPackage) return;
    if (__DEV__ && !confirmingPurchase) {
      setConfirmingPurchase(true);
      return;
    }
    // Production builds skip the double-confirm step above (__DEV__ === false)
    setConfirmingPurchase(false);
    setError(null);
    try {
      await purchase(monthlyPackage);
      handleClose();
    } catch (err: unknown) {
      const e = err as Record<string, unknown>;
      if (e?.userCancelled) return;
      setError("Purchase failed. Please try again.");
    }
  };

  const handleRestore = async () => {
    setError(null);
    setRestored(false);
    try {
      await restore();
      setRestored(true);
      setTimeout(handleClose, 1200);
    } catch {
      setError("Restore failed. Please try again.");
    }
  };

  useEffect(() => {
    if (isPremium && visible) {
      setError(null);
      setRestored(false);
      setConfirmingPurchase(false);
      onClose();
    }
  }, [isPremium, visible, onClose]);

  const ctaLabel = isPurchasing
    ? "Processing…"
    : confirmingPurchase
      ? "Tap again to confirm (test purchase)"
      : isAvailable
        ? `Subscribe · ${priceString}/mo`
        : "Subscriptions Coming Soon";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
          <Pressable
            onPress={handleClose}
            style={styles.closeBtn}
            accessibilityRole="button"
            accessibilityLabel="Close paywall"
          >
            <Text style={[styles.closeText, { color: colors.muted }]}>✕</Text>
          </Pressable>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={styles.crown}>♛</Text>

            <Text
              style={[
                styles.title,
                { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" },
              ]}
            >
              Sacred Words Premium
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: colors.muted, fontFamily: "Lato_400Regular" },
              ]}
            >
              Unlimited access to sacred prayer generation
            </Text>

            <View
              style={[
                styles.priceBox,
                { backgroundColor: colors.goldLight, borderColor: colors.gold },
              ]}
            >
              {priceString ? (
                <Text
                  style={[
                    styles.price,
                    { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" },
                  ]}
                >
                  {priceString}
                  <Text style={[styles.pricePer, { fontFamily: "Lato_400Regular", color: colors.muted }]}>
                    {" "}/ month
                  </Text>
                </Text>
              ) : (
                <Text
                  style={[
                    styles.priceUnavailable,
                    { color: colors.muted, fontFamily: "Lato_400Regular" },
                  ]}
                >
                  {isRcConfigured ? "Loading price…" : "Subscriptions coming soon"}
                </Text>
              )}
            </View>

            <View style={styles.benefits}>
              {BENEFITS.map((b) => (
                <View key={b.text} style={styles.benefitRow}>
                  <Text style={[styles.benefitIcon, { color: colors.gold }]}>✦</Text>
                  <Text
                    style={[
                      styles.benefitText,
                      { color: colors.ink, fontFamily: "Lato_400Regular" },
                    ]}
                  >
                    {b.text}
                  </Text>
                </View>
              ))}
            </View>

            {!!error && (
              <Text style={[styles.statusText, { color: "#C0392B", fontFamily: "Lato_400Regular" }]}>
                {error}
              </Text>
            )}
            {restored && !error && (
              <Text style={[styles.statusText, { color: colors.sage, fontFamily: "Lato_700Bold" }]}>
                Purchases restored!
              </Text>
            )}

            <Pressable
              onPress={handleSubscribe}
              disabled={isPurchasing || !isAvailable}
              accessibilityRole="button"
              accessibilityLabel={ctaLabel}
              style={[
                styles.subscribeBtn,
                { backgroundColor: isAvailable ? colors.gold : colors.muted },
                (isPurchasing || !isAvailable) && styles.btnDisabled,
              ]}
            >
              {isPurchasing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.subscribeBtnText, { fontFamily: "Lato_700Bold" }]}>
                  {ctaLabel}
                </Text>
              )}
            </Pressable>

            <Pressable
              onPress={handleRestore}
              disabled={isRestoring || !isRcConfigured}
              accessibilityRole="button"
              accessibilityLabel="Restore previous purchases"
              style={styles.restoreBtn}
            >
              <Text style={[styles.restoreText, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                {isRestoring ? "Restoring…" : "Restore Purchases"}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(30, 21, 53, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    maxHeight: "90%",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  closeText: { fontSize: 18, fontWeight: "600" },
  content: {
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
    alignItems: "center",
    gap: 20,
  },
  crown: {
    fontSize: 48,
    color: "#D4883A",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: -8,
  },
  priceBox: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    width: "100%",
  },
  price: {
    fontSize: 28,
    textAlign: "center",
  },
  pricePer: {
    fontSize: 16,
  },
  priceUnavailable: {
    fontSize: 16,
    textAlign: "center",
  },
  benefits: {
    width: "100%",
    gap: 12,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitIcon: {
    fontSize: 16,
    width: 20,
    textAlign: "center",
  },
  benefitText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  statusText: {
    fontSize: 14,
    textAlign: "center",
  },
  subscribeBtn: {
    width: "100%",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.7 },
  subscribeBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  restoreBtn: {
    paddingVertical: 4,
  },
  restoreText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
