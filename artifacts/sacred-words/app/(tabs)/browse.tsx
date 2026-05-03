import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { LoadingCards } from "@/components/LoadingPrayer";
import { Toast } from "@/components/Toast";
import { useToast } from "@/hooks/useToast";
import { savePrayer } from "@/hooks/useDatabase";
import { useGetBrowsePrayers } from "@workspace/api-client-react";
import type { CommunityPrayer } from "@workspace/api-client-react";

const TRADITION_FILTERS = ["All", "Universal", "Christian", "Jewish", "Islamic", "Buddhist", "Hindu", "Indigenous"];

interface CommunityPrayerCardProps {
  prayer: CommunityPrayer;
  onPress: () => void;
}

function CommunityPrayerCard({ prayer, onPress }: CommunityPrayerCardProps) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Community prayer: ${prayer.title}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.parchment,
          borderColor: colors.border,
          shadowColor: colors.shadow,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={[styles.cardTitle, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          {prayer.title}
        </Text>
        <View style={styles.cardBadges}>
          <View style={[styles.badge, { backgroundColor: colors.sageLight }]}>
            <Text style={[styles.badgeText, { color: colors.sage, fontFamily: "Lato_700Bold" }]}>
              {prayer.tradition}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.goldLight }]}>
            <Text style={[styles.badgeText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
              {prayer.intention}
            </Text>
          </View>
        </View>
      </View>
      <Text
        numberOfLines={2}
        style={[styles.cardExcerpt, { color: colors.muted, fontFamily: "PlayfairDisplay_400Regular_Italic" }]}
      >
        {prayer.text}
      </Text>
    </Pressable>
  );
}

export default function BrowseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { toast, showToast } = useToast();
  const [selectedTradition, setSelectedTradition] = useState("All");
  const [selectedPrayer, setSelectedPrayer] = useState<CommunityPrayer | null>(null);

  const { data, isLoading, isError, refetch } = useGetBrowsePrayers(
    { tradition: selectedTradition },
    { query: { queryKey: ["browse-prayers", selectedTradition] } }
  );

  const prayers = data?.prayers ?? [];

  const handleSavePrayer = async () => {
    if (!selectedPrayer) return;
    try {
      await savePrayer({
        title: selectedPrayer.title,
        tradition: selectedPrayer.tradition,
        intention: selectedPrayer.intention,
        text: selectedPrayer.text,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast("Saved to your library");
      setSelectedPrayer(null);
    } catch {
      showToast("Could not save prayer", "error");
    }
  };

  const handleSharePrayer = async () => {
    if (!selectedPrayer) return;
    const shareText = `"${selectedPrayer.text}"\n\n— ${selectedPrayer.title} | Sacred Words`;
    try {
      await Share.share({ message: shareText, title: selectedPrayer.title });
    } catch {
      // cancelled
    }
  };

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 20;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const modalBottom = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <Toast message={toast?.message ?? ""} type={toast?.type} visible={!!toast} />

      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.headerTitle, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          Community Prayers
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterChips}
        >
          {TRADITION_FILTERS.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setSelectedTradition(filter)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedTradition === filter }}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedTradition === filter ? colors.gold : colors.parchment,
                  borderColor: selectedTradition === filter ? colors.gold : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color: selectedTradition === filter ? "#fff" : colors.ink,
                    fontFamily: selectedTradition === filter ? "Lato_700Bold" : "Lato_400Regular",
                  },
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <LoadingCards />
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
            Could not load community prayers.
          </Text>
          <Pressable
            onPress={() => refetch()}
            style={[styles.retryBtn, { borderColor: colors.gold }]}
          >
            <Text style={[styles.retryText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
              Try again
            </Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={prayers}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CommunityPrayerCard prayer={item} onPress={() => setSelectedPrayer(item)} />
          )}
          contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 120 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={prayers.length > 0}
        />
      )}

      {/* Prayer detail modal */}
      <Modal
        visible={!!selectedPrayer}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedPrayer(null)}
      >
        <View style={[styles.modal, { backgroundColor: colors.cream }]}>
          {/* Drag handle */}
          <View style={styles.dragHandle}>
            <View style={[styles.dragBar, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            onPress={() => setSelectedPrayer(null)}
            accessibilityRole="button"
            accessibilityLabel="Close"
            style={styles.closeBtn}
          >
            <Feather name="x" size={22} color={colors.muted} />
          </Pressable>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.modalScroll, { paddingBottom: modalBottom + 120 }]}
          >
            <View style={styles.modalBadges}>
              <View style={[styles.badge, { backgroundColor: colors.sageLight }]}>
                <Text style={[styles.badgeText, { color: colors.sage, fontFamily: "Lato_700Bold" }]}>
                  {selectedPrayer?.tradition}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.goldLight }]}>
                <Text style={[styles.badgeText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
                  {selectedPrayer?.intention}
                </Text>
              </View>
            </View>

            <Text style={[styles.modalTitle, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
              {selectedPrayer?.title}
            </Text>
            <Text style={[styles.modalText, { color: colors.ink, fontFamily: "PlayfairDisplay_400Regular_Italic" }]}>
              {selectedPrayer?.text}
            </Text>
          </ScrollView>

          <View style={[styles.modalActions, { paddingBottom: modalBottom + 16, borderTopColor: colors.border, backgroundColor: colors.cream }]}>
            <Pressable
              onPress={handleSharePrayer}
              accessibilityRole="button"
              accessibilityLabel="Share this prayer"
              style={[styles.modalBtn, { backgroundColor: colors.sage }]}
            >
              <Text style={[styles.modalBtnText, { fontFamily: "Lato_700Bold" }]}>Share</Text>
            </Pressable>
            <Pressable
              onPress={handleSavePrayer}
              accessibilityRole="button"
              accessibilityLabel="Save to my library"
              style={[styles.modalBtn, { backgroundColor: colors.gold }]}
            >
              <Text style={[styles.modalBtnText, { fontFamily: "Lato_700Bold" }]}>Save to My Library</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, gap: 16 },
  headerTitle: { fontSize: 28, lineHeight: 36 },
  filterChips: { gap: 10, paddingRight: 20 },
  filterChip: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipText: { fontSize: 14 },
  list: { paddingTop: 8 },
  card: {
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    gap: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: { gap: 8 },
  cardTitle: { fontSize: 18 },
  cardBadges: { flexDirection: "row", gap: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 100 },
  badgeText: { fontSize: 12 },
  cardExcerpt: { fontSize: 14, lineHeight: 22, fontStyle: "italic" },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16 },
  errorText: { fontSize: 16, textAlign: "center" },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5 },
  retryText: { fontSize: 15 },
  modal: { flex: 1 },
  dragHandle: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
  dragBar: { width: 40, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", top: 16, right: 16, zIndex: 10, padding: 8 },
  modalScroll: { paddingHorizontal: 20, paddingTop: 16, gap: 20 },
  modalBadges: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  modalTitle: { fontSize: 26, lineHeight: 34 },
  modalText: { fontSize: 20, lineHeight: 36 },
  modalActions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },
  modalBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: { color: "#FFFFFF", fontSize: 16 },
});
