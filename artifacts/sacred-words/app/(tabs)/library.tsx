import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { PrayerCard } from "@/components/PrayerCard";
import { useSavedPrayers, searchPrayers } from "@/hooks/useDatabase";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import type { SavedPrayer } from "@/hooks/useDatabase";

function EmptyState() {
  const colors = useColors();
  const router = useRouter();
  const flameOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) return;

      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(flameOpacity, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(flameOpacity, {
            toValue: 1.0,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(flameOpacity, {
            toValue: 0.85,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(flameOpacity, {
            toValue: 1.0,
            duration: 300,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    });

    return () => {
      animation?.stop();
    };
  }, [flameOpacity]);

  return (
    <View style={styles.emptyCenter}>
      <View style={styles.candleWrapper}>
        <Animated.View style={[styles.flame, { backgroundColor: colors.gold, opacity: flameOpacity }]} />
        <View style={[styles.wick, { backgroundColor: colors.warmBrown }]} />
        <View style={[styles.candleBody, { backgroundColor: colors.parchment, borderColor: colors.warmBrown }]} />
      </View>

      <Text style={[styles.emptyTitle, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
        Your library is empty.
      </Text>
      <Text style={[styles.emptySub, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
        Build your first prayer and save it here.
      </Text>
      <Pressable
        onPress={() => router.push("/")}
        accessibilityRole="button"
        accessibilityLabel="Build a prayer"
        style={[styles.emptyBtn, { backgroundColor: colors.gold }]}
      >
        <Text style={[styles.emptyBtnText, { fontFamily: "Lato_700Bold" }]}>
          Build a Prayer →
        </Text>
      </Pressable>
    </View>
  );
}

export default function LibraryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prayers, loading, refetch } = useSavedPrayers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPrayers, setFilteredPrayers] = useState<SavedPrayer[]>([]);
  const { isConnected } = useNetworkStatus();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  useEffect(() => {
    if (searchQuery.trim()) {
      searchPrayers(searchQuery).then((results) => {
        setFilteredPrayers(results);
      });
    } else {
      setFilteredPrayers(prayers);
    }
  }, [searchQuery, prayers]);

  const topPad = Platform.OS === "web" ? insets.top + 67 : insets.top + 20;
  const bottomPad = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.cream }]}>
      <View style={[styles.header, { paddingTop: topPad }]}>
        <Text style={[styles.headerTitle, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          My Library
        </Text>

        {isConnected === false && (
          <View style={[styles.offlineBanner, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
            <Feather name="wifi-off" size={14} color={colors.muted} />
            <Text style={[styles.offlineText, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
              Offline — showing your saved prayers
            </Text>
          </View>
        )}

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search prayers…"
            placeholderTextColor={colors.muted}
            style={[styles.searchInput, { color: colors.ink, fontFamily: "Lato_400Regular" }]}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <FlatList
        data={filteredPrayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PrayerCard
            prayer={item}
            onPress={() => router.push(`/prayer/${item.id}`)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 120 },
          filteredPrayers.length === 0 && styles.listEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        scrollEnabled={filteredPrayers.length > 0}
        ListEmptyComponent={loading ? null : <EmptyState />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerTitle: { fontSize: 28, lineHeight: 36 },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  offlineText: { fontSize: 13 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 14,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  list: { paddingTop: 8 },
  listEmpty: { flex: 1 },
  emptyCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
    paddingTop: 60,
  },
  candleWrapper: { alignItems: "center", marginBottom: 12 },
  flame: {
    width: 18,
    height: 22,
    borderRadius: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  wick: { width: 2, height: 8 },
  candleBody: {
    width: 40,
    height: 80,
    borderRadius: 4,
    borderWidth: 2,
  },
  emptyTitle: { fontSize: 22, textAlign: "center" },
  emptySub: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  emptyBtn: {
    height: 52,
    paddingHorizontal: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  emptyBtnText: { color: "#FFFFFF", fontSize: 16 },
});
