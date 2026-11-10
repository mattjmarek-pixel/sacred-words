import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface DeleteAccountSheetProps {
  visible: boolean;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteAccountSheet({
  visible,
  deleting,
  onClose,
  onConfirm,
}: DeleteAccountSheetProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!deleting) onClose();
      }}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close delete account confirmation"
          disabled={deleting}
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
          <Text style={[styles.title, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
            Delete your account?
          </Text>
          <Text style={[styles.body, { color: colors.ink, fontFamily: "Lato_400Regular" }]}>
            This permanently deletes your account, your usage history, and any prayers you&apos;ve shared with the community. This can&apos;t be undone. Prayers saved in your Library on this device will also be removed.
          </Text>
          <Text style={[styles.note, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
            If you have a subscription, deleting your account doesn&apos;t cancel it. Manage it in your App Store or Google Play settings.
          </Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              disabled={deleting}
              accessibilityRole="button"
              style={[styles.button, styles.cancelButton, { borderColor: colors.border, opacity: deleting ? 0.55 : 1 }]}
            >
              <Text style={[styles.buttonText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={deleting}
              accessibilityRole="button"
              style={[styles.button, { backgroundColor: colors.destructive, borderColor: colors.destructive, opacity: deleting ? 0.65 : 1 }]}
            >
              {deleting ? (
                <ActivityIndicator size="small" color={colors.cream} />
              ) : (
                <Text style={[styles.buttonText, { color: colors.cream, fontFamily: "Lato_700Bold" }]}>
                  Delete account
                </Text>
              )}
            </Pressable>
          </View>
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
  body: { fontSize: 15, lineHeight: 22 },
  note: { fontSize: 13, lineHeight: 19 },
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
