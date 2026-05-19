import React, { useState, useEffect } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { getPrayerById, deletePrayer } from "@/hooks/useDatabase";
import type { SavedPrayer } from "@/hooks/useDatabase";
import { ShareOptionsModal } from "@/components/ShareOptionsModal";
import { ShareToCommunityModal } from "@/components/ShareToCommunityModal";
import PrayerShareCard from "@/components/PrayerShareCard";
import { useShareAsImage } from "@/hooks/useShareAsImage";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function PrayerDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { toast, showToast } = useToast();
  const [prayer, setPrayer] = useState<SavedPrayer | null>(null);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [communityModalVisible, setCommunityModalVisible] = useState(false);

  const { cardRef, isCapturing, shareAsImage, saveToLibrary } = useShareAsImage();

  useEffect(() => {
    if (id) {
      getPrayerById(id).then(setPrayer);
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      "Delete Prayer",
      "Are you sure you want to remove this prayer from your library?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!id) return;
            await deletePrayer(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          },
        },
      ]
    );
  };

  const handleShareText = async () => {
    if (!prayer) return;
    setShareModalVisible(false);
    const shareText = `"${prayer.text}"\n\n— ${prayer.title} | Sacred Words`;
    try {
      await Share.share({ message: shareText, title: prayer.title });
    } catch {
      // cancelled
    }
  };

  const handleShareImage = async () => {
    if (!prayer) return;
    await shareAsImage({
      title: prayer.title,
      onSaveError: () => showToast("Could not share image", "error"),
    });
    setShareModalVisible(false);
  };

  const handleSaveToLibrary = async () => {
    if (!prayer) return;
    await saveToLibrary({
      title: prayer.title,
      onSaveSuccess: () => {
        setShareModalVisible(false);
        showToast("Image saved to camera roll");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
      onSaveError: () => showToast("Could not save image", "error"),
    });
  };

  const handleCopy = async () => {
    if (!prayer) return;
    try {
      const { default: Clipboard } = await import("expo-clipboard");
      await Clipboard.setStringAsync(`"${prayer.text}"\n\n— ${prayer.title} | Sacred Words`);
      showToast("Copied to clipboard");
    } catch {
      showToast("Could not copy text", "error");
    }
  };

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!prayer) {
    return (
      <View style={[styles.root, { backgroundColor: colors.cream }]} />
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <Toast message={toast?.message ?? ""} type={toast?.type} visible={!!toast} />

      {/* Off-screen share card for image capture */}
      <View style={styles.offScreen} pointerEvents="none">
        <PrayerShareCard
          ref={cardRef}
          title={prayer.title}
          text={prayer.text}
          tradition={prayer.tradition}
        />
      </View>

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
        initialTitle={prayer.title}
        initialTradition={prayer.tradition}
        initialIntention={prayer.intention}
        prayerText={prayer.text}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Feather name="chevron-left" size={22} color={colors.warmBrown} />
          <Text style={[styles.backText, { color: colors.warmBrown, fontFamily: "Lato_400Regular" }]}>
            Library
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 100 }]}
      >
        <View style={styles.metaRow}>
          <View style={[styles.badge, { backgroundColor: colors.sageLight }]}>
            <Text style={[styles.badgeText, { color: colors.sage, fontFamily: "Lato_700Bold" }]}>
              {prayer.tradition}
            </Text>
          </View>
          {prayer.intention ? (
            <View style={[styles.badge, { backgroundColor: colors.goldLight }]}>
              <Text style={[styles.badgeText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
                {prayer.intention}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.title, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          {prayer.title}
        </Text>

        <Text style={[styles.date, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
          Saved {formatDate(prayer.createdAt)}
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <Text style={[styles.prayerText, { color: colors.ink, fontFamily: "PlayfairDisplay_400Regular_Italic" }]}>
          {prayer.text}
        </Text>
      </ScrollView>

      {/* Bottom action bar */}
      <View
        style={[
          styles.actionBar,
          {
            paddingBottom: bottomPad + 16,
            borderTopColor: colors.border,
            backgroundColor: colors.cream,
          },
        ]}
      >
        <Pressable
          onPress={() => setShareModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Share this prayer"
          style={[styles.actionBtn, { backgroundColor: colors.sage }]}
        >
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={[styles.actionBtnText, { fontFamily: "Lato_700Bold" }]}>Share</Text>
        </Pressable>

        <Pressable
          onPress={() => setCommunityModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Share prayer to community"
          style={[styles.actionBtn, { backgroundColor: colors.parchment, borderColor: colors.gold, borderWidth: 1.5 }]}
        >
          <Feather name="users" size={18} color={colors.gold} />
          <Text style={[styles.actionBtnText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>Community</Text>
        </Pressable>

        <Pressable
          onPress={handleCopy}
          accessibilityRole="button"
          accessibilityLabel="Copy prayer text"
          style={[styles.actionBtn, { backgroundColor: colors.parchment, borderColor: colors.border, borderWidth: 1.5 }]}
        >
          <Feather name="copy" size={18} color={colors.warmBrown} />
          <Text style={[styles.actionBtnText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>Copy</Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete this prayer"
          style={[styles.actionBtn, { backgroundColor: "#FEF2F2", borderColor: colors.destructive, borderWidth: 1.5 }]}
        >
          <Feather name="trash-2" size={18} color={colors.destructive} />
          <Text style={[styles.actionBtnText, { color: colors.destructive, fontFamily: "Lato_700Bold" }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  offScreen: {
    position: "absolute",
    top: -2000,
    left: -2000,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  backText: { fontSize: 17 },
  scroll: { paddingHorizontal: 20, paddingTop: 24, gap: 16 },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100 },
  badgeText: { fontSize: 13 },
  title: { fontSize: 26, lineHeight: 34 },
  date: { fontSize: 14 },
  divider: { height: 1, marginVertical: 8 },
  prayerText: { fontSize: 20, lineHeight: 36 },
  actionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
    borderTopWidth: 1,
  },
  actionBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  actionBtnText: { color: "#FFFFFF", fontSize: 15 },
});
