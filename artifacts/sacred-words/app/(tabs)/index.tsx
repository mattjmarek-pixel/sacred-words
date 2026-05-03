import React, { useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { ChipSelector } from "@/components/ChipSelector";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { savePrayer } from "@/hooks/useDatabase";
import { useGeneratePrayer } from "@workspace/api-client-react";
import { Share } from "react-native";

const TRADITIONS = ["Universal", "Christian", "Jewish", "Islamic", "Buddhist", "Hindu", "Indigenous", "Secular"];
const INTENTIONS = ["Gratitude", "Healing", "Guidance", "Strength", "Grief", "Protection", "Peace", "Celebration", "Hope", "Forgiveness"];
const TONES = ["Contemplative", "Joyful", "Sorrowful", "Urgent", "Gentle", "Bold", "Quiet"];

export default function BuildScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toast, showToast } = useToast();

  const [tradition, setTradition] = useState("Universal");
  const [intentions, setIntentions] = useState<string[]>([]);
  const [tone, setTone] = useState("");
  const [context, setContext] = useState("");
  const [generatedPrayer, setGeneratedPrayer] = useState("");
  const [prayerTitle, setPrayerTitle] = useState("");

  const prayerOpacity = useRef(new Animated.Value(0)).current;
  const prayerTranslate = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const generateMutation = useGeneratePrayer();

  const handleIntentionSelect = (value: string) => {
    setIntentions((prev) => {
      if (prev.includes(value)) return prev.filter((i) => i !== value);
      if (prev.length >= 3) return prev;
      return [...prev, value];
    });
  };

  const handleGenerate = async () => {
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
    } catch {
      Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
      showToast("Something got quiet. Tap to try again.", "error");
    }
  };

  const handleSave = async () => {
    if (!generatedPrayer) return;
    try {
      const title = prayerTitle.trim() || `${tradition} prayer for ${intentions[0] ?? "reflection"}`;
      await savePrayer({
        title,
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

  const handleShare = async () => {
    if (!generatedPrayer) return;
    const title = prayerTitle.trim() || "A prayer";
    const shareText = `"${generatedPrayer}"\n\n— ${title} | Sacred Words`;
    try {
      await Share.share({ message: shareText, title });
    } catch {
      // user cancelled
    }
  };

  const handleCopy = async () => {
    if (!generatedPrayer) return;
    try {
      const { default: Clipboard } = await import("expo-clipboard");
      const title = prayerTitle.trim() || "A prayer";
      await Clipboard.setStringAsync(`"${generatedPrayer}"\n\n— ${title} | Sacred Words`);
      showToast("Copied to clipboard");
    } catch {
      showToast("Could not copy text", "error");
    }
  };

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

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
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={[styles.appName, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
            Sacred Words
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
            Build your own prayer
          </Text>
        </View>

        {/* Step 1: Tradition */}
        {sectionLabel("Your tradition", "①")}
        <ChipSelector
          options={TRADITIONS}
          selected={tradition}
          onSelect={setTradition}
          variant="gold"
          horizontal
        />

        <View style={styles.sectionGap} />

        {/* Step 2: Intentions */}
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

        {/* Step 3: Tone */}
        {sectionLabel("The feeling of this prayer", "③")}
        <ChipSelector
          options={TONES}
          selected={tone}
          onSelect={setTone}
          variant="gold"
        />

        <View style={styles.sectionGap} />

        {/* Step 4: Context */}
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

        {/* Generate Button */}
        <View style={styles.inputWrapper}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <Pressable
              onPress={handleGenerate}
              disabled={generateMutation.isPending}
              accessibilityRole="button"
              accessibilityLabel="Generate my prayer"
              android_ripple={{ color: colors.goldLight }}
              style={[
                styles.generateBtn,
                { backgroundColor: colors.gold },
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
              ) : (
                <Text style={[styles.generateBtnText, { fontFamily: "Lato_700Bold" }]}>
                  Generate My Prayer →
                </Text>
              )}
            </Pressable>
          </Animated.View>
        </View>

        {/* Prayer Output */}
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
              style={[
                styles.prayerText,
                { color: colors.ink, fontFamily: "PlayfairDisplay_400Regular_Italic" },
              ]}
            >
              {generatedPrayer}
            </Text>

            {/* Action buttons 2×2 grid */}
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
                onPress={handleShare}
                accessibilityRole="button"
                accessibilityLabel="Share this prayer"
                style={[styles.actionBtn, styles.actionBtnSolid, { backgroundColor: colors.sage }]}
              >
                <Text style={[styles.actionBtnText, { color: "#fff", fontFamily: "Lato_700Bold" }]}>
                  Share
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
  headerSection: { paddingHorizontal: 20, marginBottom: 32 },
  appName: { fontSize: 32, lineHeight: 40 },
  subtitle: { fontSize: 16, marginTop: 4 },
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
