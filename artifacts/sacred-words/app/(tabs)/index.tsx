import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { useQueryClient } from "@tanstack/react-query";
import { useColors } from "@/hooks/useColors";
import { ChipSelector } from "@/components/ChipSelector";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { savePrayer } from "@/hooks/useDatabase";
import { useGeneratePrayer, useGetPrayerUsage, getGetPrayerUsageQueryKey } from "@workspace/api-client-react";
import { Share } from "react-native";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/lib/revenuecat";
import { PaywallScreen } from "@/components/PaywallScreen";
import { ShareOptionsModal } from "@/components/ShareOptionsModal";
import { ShareToCommunityModal } from "@/components/ShareToCommunityModal";
import PrayerShareCard from "@/components/PrayerShareCard";
import { useShareAsImage } from "@/hooks/useShareAsImage";
import { MilestoneModal } from "@/components/MilestoneModal";
import { useStreak, MILESTONE_DAYS } from "@/hooks/useStreak";
import { recordTraditionUsed, getMostUsedTradition } from "@/hooks/useTraditionHistory";

const TRADITIONS = ["Universal", "Christian", "Catholic", "Jewish", "Islamic", "Buddhist", "Hindu", "Indigenous", "Secular"];
const INTENTIONS = ["Gratitude", "Healing", "Guidance", "Strength", "Grief", "Protection", "Peace", "Celebration", "Hope", "Forgiveness"];
const TONES = ["Contemplative", "Joyful", "Sorrowful", "Urgent", "Gentle", "Bold", "Quiet"];

const FREE_LIMIT = 3;

export default function BuildScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toast, showToast } = useToast();
  const { isAuthenticated, isLoading: authLoading, login } = useAuth();
  const { isPremium } = useSubscription();
  const queryClient = useQueryClient();
  const { streak, refresh: refreshStreak, record: recordStreak } = useStreak();

  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState(0);
  const [milestoneVisible, setMilestoneVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshStreak();
    }, [refreshStreak])
  );

  const [tradition, setTradition] = useState("Universal");

  useEffect(() => {
    getMostUsedTradition().then(setTradition);
  }, []);

  const usageQuery = useGetPrayerUsage({
    query: { queryKey: getGetPrayerUsageQueryKey(), enabled: isAuthenticated, staleTime: 60 * 1000 },
  });

  const genCount = usageQuery.data?.count ?? 0;
  const serverIsPremium = usageQuery.data?.isPremium ?? false;
  const effectivePremium = isPremium || serverIsPremium;

  const [intentions, setIntentions] = useState<string[]>([]);
  const [tone, setTone] = useState("");
  const [context, setContext] = useState("");
  const [generatedPrayer, setGeneratedPrayer] = useState("");
  const [prayerTitle, setPrayerTitle] = useState("");
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);

  const prayerOpacity = useRef(new Animated.Value(0)).current;
  const prayerTranslate = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const generateMutation = useGeneratePrayer();
  const { cardRef, isCapturing, shareAsImage, saveToLibrary } = useShareAsImage();

  const resolvedTitle = prayerTitle.trim() || `${tradition} prayer for ${intentions[0] ?? "reflection"}`;

  const handleIntentionSelect = (value: string) => {
    setIntentions((prev) => {
      if (prev.includes(value)) return prev.filter((i) => i !== value);
      if (prev.length >= 3) return prev;
      return [...prev, value];
    });
  };

  const handleGenerate = async () => {
    if (!effectivePremium && genCount >= FREE_LIMIT) {
      setPaywallVisible(true);
      return;
    }

    if (!tone) {
      showToast("Choose a tone for your prayer", "info");
      return;
    }
    if (intentions.length === 0) {
      showToast("Choose at least one intention", "info");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.spring(buttonScale, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();

    try {
      const result = await generateMutation.mutateAsync({
        data: { tradition, intentions, tone, context: context || undefined },
      });

      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

      setGeneratedPrayer(result.prayer);
      setPrayerTitle("");

      prayerOpacity.setValue(0);
      prayerTranslate.setValue(40);
      Animated.parallel([
        Animated.timing(prayerOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(prayerTranslate, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      void recordTraditionUsed(tradition);
      const newStreak = await recordStreak();
      if (MILESTONE_DAYS.includes(newStreak)) {
        setMilestoneStreak(newStreak);
        setMilestoneVisible(true);
      }

      queryClient.invalidateQueries({ queryKey: getGetPrayerUsageQueryKey() });
    } catch (err: unknown) {
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();

      const apiErr = err as { status?: number };
      if (apiErr?.status === 402) {
        setPaywallVisible(true);
        return;
      }

      showToast("Something got quiet. Tap to try again.", "error");
    }
  };

  const handleSave = async () => {
    if (!generatedPrayer) return;
    try {
      await savePrayer({
        title: resolvedTitle,
        tradition,
        intention: intentions.join(", "),
        text: generatedPrayer,
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      showToast("Saved to your library");
    } catch {
      showToast("Could not save prayer", "error");
    }
  };

  const handleShareText = async () => {
    setShareModalVisible(false);
    const shareText = `"${generatedPrayer}"\n\n— ${resolvedTitle} | Sacred Words`;
    try {
      await Share.share({ message: shareText, title: resolvedTitle });
    } catch {
      // user cancelled
    }
  };

  const handleShareImage = async () => {
    await shareAsImage({
      title: resolvedTitle,
      onSaveError: () => showToast("Could not share image", "error"),
    });
    setShareModalVisible(false);
  };

  const handleSaveToLibrary = async () => {
    await saveToLibrary({
      title: resolvedTitle,
      onSaveSuccess: () => {
        setShareModalVisible(false);
        showToast("Image saved to camera roll");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onSaveError: () => showToast("Could not save image", "error"),
    });
  };

  const handleCopy = async () => {
    if (!generatedPrayer) return;
    try {
      const { default: Clipboard } = await import("expo-clipboard");
      await Clipboard.setStringAsync(`"${generatedPrayer}"\n\n— ${resolvedTitle} | Sacred Words`);
      showToast("Copied to clipboard");
    } catch {
      showToast("Could not copy text", "error");
    }
  };

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  const limitReached = isAuthenticated && !effectivePremium && genCount >= FREE_LIMIT;

  const sectionLabel = useCallback(
    (text: string, step: string) => (
      <View style={styles.sectionHeader}>
        <Text style={[styles.stepBadge, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
          {step}
        </Text>
        <Text style={[styles.sectionLabel, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          {text}
        </Text>
      </View>
    ),
    [colors]
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <Toast message={toast?.message ?? ""} type={toast?.type} visible={!!toast} />

      <PaywallScreen
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />

      <MilestoneModal
        visible={milestoneVisible}
        streak={milestoneStreak}
        onClose={() => setMilestoneVisible(false)}
      />

      {/* Off-screen share card for image capture */}
      {generatedPrayer ? (
        <View style={styles.offScreen} pointerEvents="none">
          <PrayerShareCard
            ref={cardRef}
            title={resolvedTitle}
            text={generatedPrayer}
            tradition={tradition}
          />
        </View>
      ) : null}

      <ShareOptionsModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        onShareAsImage={handleShareImage}
        onSaveToLibrary={handleSaveToLibrary}
        onShareAsText={handleShareText}
        isCapturing={isCapturing}
      />

      <ShareToCommunityModal
        visible={communityModalVisible}
        onClose={() => setCommunityModalVisible(false)}
        onSuccess={() => {
          setCommunityModalVisible(false);
          showToast("Your prayer is now in the community collection");
        }}
        initialTitle={resolvedTitle}
        initialTradition={tradition}
        initialIntention={intentions[0] ?? "Reflection"}
        prayerText={generatedPrayer}
      />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 120 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bottomOffset={20}
      >
        {streak > 0 && (
          <View style={[styles.streakBadge, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
            <Text style={[styles.streakText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
              🔥 {streak}-day streak
            </Text>
          </View>
        )}

        {!authLoading && !isAuthenticated && !bannerDismissed && (
          <View style={[styles.signInBanner, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
            <Pressable
              onPress={login}
              accessibilityRole="button"
              accessibilityLabel="Sign in to generate prayers"
              style={styles.signInBannerMain}
            >
              <Text style={[styles.signInBannerText, { color: colors.warmBrown, fontFamily: "Lato_400Regular" }]}>
                Sign in to generate your own prayers
              </Text>
              <Text style={[styles.signInBannerCta, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
                Sign in →
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setBannerDismissed(true)}
              accessibilityRole="button"
              accessibilityLabel="Dismiss sign-in prompt"
              hitSlop={8}
            >
              <Text style={[styles.signInBannerDismiss, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>✕</Text>
            </Pressable>
          </View>
        )}

        {sectionLabel("Your tradition", "①")}
        <ChipSelector
          options={TRADITIONS}
          selected={tradition}
          onSelect={setTradition}
          variant="gold"
          horizontal
        />

        <View style={styles.sectionGap} />

        {sectionLabel("What brings you here?", "②")}
        <Text style={[styles.hint, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
          Choose up to 3
        </Text>
        <ChipSelector
          options={INTENTIONS}
          selected={intentions}
          onSelect={handleIntentionSelect}
          multiSelect
          maxSelect={3}
          variant="sage"
        />

        <View style={styles.sectionGap} />

        {sectionLabel("The feeling of this prayer", "③")}
        <ChipSelector
          options={TONES}
          selected={tone}
          onSelect={setTone}
          variant="gold"
        />

        <View style={styles.sectionGap} />

        {sectionLabel("What's on your heart?", "④")}
        <View style={styles.inputWrapper}>
          <TextInput
            value={context}
            onChangeText={setContext}
            placeholder="You can add names, a situation, or anything that feels important…"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.contextInput,
              {
                backgroundColor: colors.parchment,
                borderColor: colors.border,
                color: colors.ink,
                fontFamily: "PlayfairDisplay_400Regular_Italic",
              },
            ]}
          />
        </View>

        <View style={styles.sectionGap} />

        <View style={styles.inputWrapper}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
              accessibilityRole="button"
              accessibilityLabel={
                limitReached ? "Unlock unlimited generations"
                : "Generate my prayer"
              }
              android_ripple={{ color: colors.goldLight }}
              style={[
                styles.generateBtn,
                { backgroundColor: limitReached ? colors.sage : colors.gold },
                generateMutation.isPending && styles.generateBtnLoading,
              ]}
            >
              {generateMutation.isPending ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" size="small" />
                  <Text style={[styles.generateBtnText, { fontFamily: "Lato_700Bold" }]}>
                    Writing your prayer…
                  </Text>
                </View>
              ) : limitReached ? (
                <Text style={[styles.generateBtnText, { fontFamily: "Lato_700Bold" }]}>
                  ♛ Unlock Unlimited →
                </Text>
              ) : (
                <Text style={[styles.generateBtnText, { fontFamily: "Lato_700Bold" }]}>
                  Generate My Prayer →
                </Text>
              )}
            </Pressable>
          </Animated.View>

          {isAuthenticated && !effectivePremium && !limitReached && (
            <Text style={[styles.genLimit, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
              {genCount} of {FREE_LIMIT} free prayer{genCount === 1 ? "" : "s"} used this month
            </Text>
          )}
          {limitReached && (
            <Text style={[styles.genLimit, { color: colors.sage, fontFamily: "Lato_400Regular" }]}>
              Monthly limit reached — upgrade to generate unlimited prayers
            </Text>
          )}
        </View>

        {generatedPrayer ? (
          <Animated.View
            style={[
              styles.prayerCard,
              {
                backgroundColor: colors.parchment,
                borderColor: colors.border,
                opacity: prayerOpacity,
                transform: [{ translateY: prayerTranslate }],
              },
            ]}
          >
            <TextInput
              value={prayerTitle}
              onChangeText={setPrayerTitle}
              placeholder="Name this prayer…"
              placeholderTextColor={colors.muted}
              style={[
                styles.prayerTitleInput,
                {
                  color: colors.warmBrown,
                  borderBottomColor: colors.border,
                  fontFamily: "PlayfairDisplay_600SemiBold",
                },
              ]}
            />

            <Text
              selectable
              style={[
                styles.prayerText,
                { color: colors.ink, fontFamily: "PlayfairDisplay_400Regular_Italic" },
              ]}
            >
              {generatedPrayer}
            </Text>

            <View style={styles.actionGrid}>
              <Pressable
                onPress={handleSave}
                accessibilityRole="button"
                accessibilityLabel="Save to library"
                style={[styles.actionBtn, styles.actionBtnSolid, { backgroundColor: colors.gold }]}
              >
                <Text style={[styles.actionBtnText, { color: "#fff", fontFamily: "Lato_700Bold" }]}>
                  Save to Library
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShareModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Share this prayer"
                style={[styles.actionBtn, styles.actionBtnSolid, { backgroundColor: colors.sage }]}
              >
                <Text style={[styles.actionBtnText, { color: "#fff", fontFamily: "Lato_700Bold" }]}>
                  Share
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setCommunityModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Share prayer to community"
                style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: colors.gold }]}
              >
                <Text style={[styles.actionBtnText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
                  Share to Community
                </Text>
              </Pressable>

              <Pressable
                onPress={handleCopy}
                accessibilityRole="button"
                accessibilityLabel="Copy prayer text"
                style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: colors.border }]}
              >
                <Text style={[styles.actionBtnText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                  Copy Text
                </Text>
              </Pressable>

              <Pressable
                onPress={handleGenerate}
                disabled={generateMutation.isPending}
                accessibilityRole="button"
                accessibilityLabel="Generate another prayer"
                style={[styles.actionBtn, styles.actionBtnOutline, { borderColor: colors.border }]}
              >
                <Text style={[styles.actionBtnText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                  Generate Again
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        ) : null}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  signInBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signInBannerMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signInBannerText: { fontSize: 14, flex: 1 },
  signInBannerCta: { fontSize: 14 },
  signInBannerDismiss: { fontSize: 16, paddingHorizontal: 4 },
  streakBadge: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 100,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },
  streakText: { fontSize: 14 },
  offScreen: {
    position: "absolute",
    top: -2000,
    left: -2000,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  stepBadge: { fontSize: 18 },
  sectionLabel: { fontSize: 18 },
  hint: { fontSize: 13, paddingHorizontal: 20, marginTop: -6, marginBottom: 4 },
  sectionGap: { height: 28 },
  inputWrapper: { paddingHorizontal: 20 },
  contextInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 17,
    lineHeight: 26,
    minHeight: 110,
  },
  generateBtn: {
    height: 56,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  generateBtnLoading: { opacity: 0.85 },
  generateBtnText: { color: "#FFFFFF", fontSize: 18 },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  genLimit: {
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  prayerCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    gap: 20,
    shadowColor: "rgba(92, 61, 46, 0.12)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  prayerTitleInput: {
    fontSize: 20,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  prayerText: {
    fontSize: 20,
    lineHeight: 36,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    minWidth: "45%",
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnSolid: {},
  actionBtnOutline: { borderWidth: 1.5 },
  actionBtnText: { fontSize: 15 },
});
