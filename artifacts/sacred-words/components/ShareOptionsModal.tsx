import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface ShareOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onShareAsImage: () => void;
  onSaveToLibrary: () => void;
  onShareAsText: () => void;
  isCapturing: boolean;
}

export function ShareOptionsModal({
  visible,
  onClose,
  onShareAsImage,
  onSaveToLibrary,
  onShareAsText,
  isCapturing,
}: ShareOptionsModalProps) {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.cream, borderColor: colors.border }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <Text style={[styles.heading, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
          Share this prayer
        </Text>

        {isCapturing ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.gold} />
            <Text style={[styles.loadingText, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
              Preparing image…
            </Text>
          </View>
        ) : (
          <View style={styles.options}>
            <Pressable
              onPress={onShareAsImage}
              accessibilityRole="button"
              accessibilityLabel="Share as styled image"
              style={({ pressed }) => [
                styles.optionBtn,
                { backgroundColor: colors.gold, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="image" size={20} color="#fff" />
              <View style={styles.optionTextGroup}>
                <Text style={[styles.optionTitle, { color: "#fff", fontFamily: "Lato_700Bold" }]}>
                  Share as Image
                </Text>
                <Text style={[styles.optionSub, { color: "rgba(255,255,255,0.8)", fontFamily: "Lato_400Regular" }]}>
                  Beautiful card — great for Instagram &amp; WhatsApp
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onSaveToLibrary}
              accessibilityRole="button"
              accessibilityLabel="Save image to camera roll"
              style={({ pressed }) => [
                styles.optionBtn,
                { backgroundColor: colors.sage, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="download" size={20} color="#fff" />
              <View style={styles.optionTextGroup}>
                <Text style={[styles.optionTitle, { color: "#fff", fontFamily: "Lato_700Bold" }]}>
                  Save to Camera Roll
                </Text>
                <Text style={[styles.optionSub, { color: "rgba(255,255,255,0.8)", fontFamily: "Lato_400Regular" }]}>
                  Keep the image in your photo library
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onShareAsText}
              accessibilityRole="button"
              accessibilityLabel="Share as plain text"
              style={({ pressed }) => [
                styles.optionBtn,
                styles.optionBtnOutline,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.parchment,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Feather name="type" size={20} color={colors.warmBrown} />
              <View style={styles.optionTextGroup}>
                <Text style={[styles.optionTitle, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
                  Share as Text
                </Text>
                <Text style={[styles.optionSub, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
                  Plain text via any app
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          style={[styles.cancelBtn, { borderColor: colors.border }]}
        >
          <Text style={[styles.cancelText, { color: colors.muted, fontFamily: "Lato_700Bold" }]}>
            Cancel
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(46,35,24,0.45)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 4,
  },
  heading: {
    fontSize: 22,
    textAlign: "center",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  options: {
    gap: 10,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  optionBtnOutline: {
    borderWidth: 1.5,
  },
  optionTextGroup: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 17,
  },
  optionSub: {
    fontSize: 13,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
  },
});
