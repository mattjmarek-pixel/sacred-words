import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { Image } from "expo-image";

import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/lib/revenuecat";
import { PaywallScreen } from "@/components/PaywallScreen";

interface ProfileButtonProps {
  onGoPremium: () => void;
}

function ProfileButton({ onGoPremium }: ProfileButtonProps) {
  const colors = useColors();
  const { user, isAuthenticated, login, logout } = useAuth();
  const { isPremium } = useSubscription();

  if (!isAuthenticated) {
    return (
      <Pressable
        onPress={login}
        accessibilityRole="button"
        accessibilityLabel="Sign in"
        style={[styles.signInBtn, { borderColor: colors.gold }]}
      >
        <Text style={[styles.signInText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
          Sign in
        </Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.profileRow}>
      {!isPremium && (
        <Pressable
          onPress={onGoPremium}
          accessibilityRole="button"
          accessibilityLabel="Go Premium"
          style={[styles.proBadge, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}
        >
          <Text style={[styles.proBadgeText, { color: colors.gold, fontFamily: "Lato_700Bold" }]}>
            ♛ Pro
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={logout}
        accessibilityRole="button"
        accessibilityLabel="Sign out"
        style={styles.avatarBtn}
      >
        {user?.profileImageUrl ? (
          <View>
            <Image
              source={{ uri: user.profileImageUrl }}
              style={[
                styles.avatar,
                { borderColor: isPremium ? colors.gold : colors.border },
              ]}
              contentFit="cover"
            />
            {isPremium && (
              <View style={[styles.crownBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.crownText}>♛</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View
              style={[
                styles.avatarFallback,
                {
                  backgroundColor: isPremium ? colors.goldLight : colors.parchment,
                  borderColor: isPremium ? colors.gold : colors.border,
                },
              ]}
            >
              <Text style={[styles.avatarInitial, { color: isPremium ? colors.gold : colors.muted, fontFamily: "Lato_700Bold" }]}>
                {(user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
              </Text>
            </View>
            {isPremium && (
              <View style={[styles.crownBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.crownText}>♛</Text>
              </View>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  const [paywallVisible, setPaywallVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.gold,
          tabBarInactiveTintColor: colors.muted,
          headerShown: true,
          headerStyle: { backgroundColor: colors.cream },
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: "PlayfairDisplay_600SemiBold",
            color: colors.warmBrown,
            fontSize: 20,
          },
          headerRight: () => (
            <ProfileButton onGoPremium={() => setPaywallVisible(true)} />
          ),
          headerRightContainerStyle: { paddingRight: 16 },
          tabBarStyle: {
            position: "absolute",
            backgroundColor: isIOS ? "transparent" : colors.cream,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            elevation: 0,
            ...(isWeb ? { height: 84 } : {}),
          },
          tabBarBackground: () =>
            isIOS ? (
              <BlurView
                intensity={80}
                tint={isDark ? "dark" : "extraLight"}
                style={StyleSheet.absoluteFill}
              />
            ) : isWeb ? (
              <View
                style={[StyleSheet.absoluteFill, { backgroundColor: colors.cream }]}
              />
            ) : null,
          tabBarLabelStyle: {
            fontFamily: "Lato_700Bold",
            fontSize: 12,
            marginBottom: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Sacred Words",
            tabBarLabel: "Build",
            tabBarIcon: ({ color }) => (
              <Feather name="edit-3" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "My Library",
            tabBarLabel: "Library",
            tabBarIcon: ({ color }) => (
              <Feather name="bookmark" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="browse"
          options={{
            title: "Community Prayers",
            tabBarLabel: "Browse",
            tabBarIcon: ({ color }) => (
              <Feather name="globe" size={22} color={color} />
            ),
          }}
        />
      </Tabs>

      <PaywallScreen
        visible={paywallVisible}
        onClose={() => setPaywallVisible(false)}
      />
    </>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <ClassicTabLayout />;
  }
  return <ClassicTabLayout />;
}

const styles = StyleSheet.create({
  signInBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  signInText: { fontSize: 14 },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  proBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  proBadgeText: { fontSize: 13 },
  avatarBtn: { padding: 2 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
  },
  avatarFallback: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 14 },
  crownBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  crownText: {
    fontSize: 8,
    color: "#fff",
  },
});
