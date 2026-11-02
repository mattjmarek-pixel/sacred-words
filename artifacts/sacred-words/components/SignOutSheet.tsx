import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface SignOutSheetProps {
  visible: boolean;
  user: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  } | null;
  onClose: () => void;
  onSignOut: () => Promise<void>;
}

export function SignOutSheet({
  visible,
  user,
  onClose,
  onSignOut,
}: SignOutSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [confirming, setConfirming] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!visible) {
      setConfirming(false);
      setSigningOut(false);
    }
  }, [visible]);

  const confirmSignOut = async () => {
    setSigningOut(true);
    try {
      await onSignOut();
      onClose();
    } finally {
      setSigningOut(false);
    }
  };

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close account menu"
          onPress={onClose}
          style={[StyleSheet.absoluteFill, styles.backdrop, { backgroundColor: colors.ink }]}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.parchment,
              borderColor: colors.border,
              paddingBottom: Math.max(insets.bottom, 16) + 12,
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {confirming ? (
            <>
              <Text
                style={[
                  styles.title,
                  { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" },
                ]}
              >
                Sign out of Sacred Words?
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: colors.muted, fontFamily: "Lato_400Regular" },
                ]}
              >
                You can sign back in at any time.
              </Text>
              <View style={styles.actions}>
                <Pressable
                  onPress={() => setConfirming(false)}
                  accessibilityRole="button"
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                >
                  <Text style={[styles.buttonText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={confirmSignOut}
                  disabled={signingOut}
                  accessibilityRole="button"
                  style={[styles.button, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}
                >
                  <Text style={[styles.buttonText, { color: colors.cream, fontFamily: "Lato_700Bold" }]}>
                    {signingOut ? "Signing out…" : "Sign out"}
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.title,
                  { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" },
                ]}
              >
                {fullName || user?.email || "Your account"}
              </Text>
              {!!user?.email && !!fullName && (
                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.muted, fontFamily: "Lato_400Regular" },
                  ]}
                >
                  {user.email}
                </Text>
              )}
              <View style={styles.actions}>
                <Pressable
                  onPress={onClose}
                  accessibilityRole="button"
                  style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
                >
                  <Text style={[styles.buttonText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setConfirming(true)}
                  accessibilityRole="button"
                  style={[styles.button, { backgroundColor: colors.destructive, borderColor: colors.destructive }]}
                >
                  <Text style={[styles.buttonText, { color: colors.cream, fontFamily: "Lato_700Bold" }]}>
                    Sign out
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { opacity: 0.45 },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    gap: 12,
  },
  handle: {
    alignSelf: "center",
    width: 38,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  title: { fontSize: 20, textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center" },
  actions: { flexDirection: "row", gap: 10, marginTop: 8 },
  button: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  cancelButton: { backgroundColor: "transparent" },
  buttonText: { fontSize: 15 },
});
