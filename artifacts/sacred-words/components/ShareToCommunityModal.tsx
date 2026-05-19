import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSubmitCommunityPrayer } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

const TRADITIONS = [
  "Universal", "Christian", "Catholic", "Jewish", "Islamic",
  "Buddhist", "Hindu", "Indigenous", "Secular",
];

interface ShareToCommunityModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialTitle: string;
  initialTradition: string;
  initialIntention: string;
  prayerText: string;
}

export function ShareToCommunityModal({
  visible,
  onClose,
  onSuccess,
  initialTitle,
  initialTradition,
  initialIntention,
  prayerText,
}: ShareToCommunityModalProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(initialTitle);
  const [tradition, setTradition] = useState(initialTradition);

  const submitMutation = useSubmitCommunityPrayer();
  const { isAuthenticated, login } = useAuth();
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
      setTradition(initialTradition);
      setNeedsLogin(false);
      submitMutation.reset();
    }
  }, [visible, initialTitle, initialTradition]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    if (!isAuthenticated) {
      setNeedsLogin(true);
      return;
    }

    try {
      await submitMutation.mutateAsync({
        data: {
          title: title.trim(),
          tradition: tradition.trim() || "Universal",
          intention: initialIntention || "Reflection",
          text: prayerText,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["browse-prayers"] });
      onSuccess();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr?.response?.status === 401) {
        setNeedsLogin(true);
      }
      // other errors shown via submitMutation.isError
    }
  };

  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[styles.root, { backgroundColor: colors.cream }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.dragHandle}>
          <View style={[styles.dragBar, { backgroundColor: colors.border }]} />
        </View>

        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
          style={styles.closeBtn}
        >
          <Text style={[styles.closeX, { color: colors.muted }]}>✕</Text>
        </Pressable>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad + 120 }]}
        >
          <Text style={[styles.heading, { color: colors.warmBrown, fontFamily: "PlayfairDisplay_600SemiBold" }]}>
            Share to Community
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted, fontFamily: "Lato_400Regular" }]}>
            Your prayer will appear in the Browse tab for everyone to read and save.
          </Text>

          <View style={[styles.prayerPreview, { backgroundColor: colors.parchment, borderColor: colors.border }]}>
            <Text
              numberOfLines={4}
              style={[styles.prayerPreviewText, { color: colors.ink, fontFamily: "PlayfairDisplay_400Regular_Italic" }]}
            >
              {prayerText}
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
            Title
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Give this prayer a name…"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              {
                backgroundColor: colors.parchment,
                borderColor: colors.border,
                color: colors.ink,
                fontFamily: "PlayfairDisplay_400Regular",
              },
            ]}
            returnKeyType="done"
          />

          <Text style={[styles.label, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
            Tradition
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}
          >
            {TRADITIONS.map((t) => (
              <Pressable
                key={t}
                onPress={() => setTradition(t)}
                accessibilityRole="radio"
                accessibilityState={{ selected: tradition === t }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: tradition === t ? colors.gold : colors.parchment,
                    borderColor: tradition === t ? colors.gold : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: tradition === t ? "#fff" : colors.ink,
                      fontFamily: tradition === t ? "Lato_700Bold" : "Lato_400Regular",
                    },
                  ]}
                >
                  {t}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {needsLogin && (
            <View style={[styles.errorBox, { backgroundColor: colors.goldLight, borderColor: colors.gold }]}>
              <Text style={[styles.errorText, { color: colors.warmBrown, fontFamily: "Lato_400Regular" }]}>
                You need to sign in to share with the community.
              </Text>
              <Pressable
                onPress={login}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                style={[styles.signInBtn, { backgroundColor: colors.gold }]}
              >
                <Text style={[styles.signInBtnText, { fontFamily: "Lato_700Bold" }]}>Sign In →</Text>
              </Pressable>
            </View>
          )}

          {submitMutation.isError && !needsLogin && (
            <View style={[styles.errorBox, { backgroundColor: "#FEF2F2", borderColor: colors.destructive }]}>
              <Text style={[styles.errorText, { color: colors.destructive, fontFamily: "Lato_400Regular" }]}>
                Something went wrong. Please try again.
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.actions,
            {
              paddingBottom: bottomPad + 16,
              borderTopColor: colors.border,
              backgroundColor: colors.cream,
            },
          ]}
        >
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            style={[styles.actionBtn, styles.cancelBtn, { borderColor: colors.border }]}
          >
            <Text style={[styles.actionBtnText, { color: colors.warmBrown, fontFamily: "Lato_700Bold" }]}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            disabled={submitMutation.isPending || !title.trim()}
            accessibilityRole="button"
            accessibilityLabel="Submit prayer to community"
            style={[
              styles.actionBtn,
              styles.submitBtn,
              { backgroundColor: !title.trim() ? colors.muted : colors.gold },
            ]}
          >
            {submitMutation.isPending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={[styles.actionBtnText, { color: "#fff", fontFamily: "Lato_700Bold" }]}>
                Share with Community
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  dragHandle: { alignItems: "center", paddingTop: 12, paddingBottom: 4 },
  dragBar: { width: 40, height: 4, borderRadius: 2 },
  closeBtn: { position: "absolute", top: 16, right: 16, zIndex: 10, padding: 8 },
  closeX: { fontSize: 18 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, gap: 12 },
  heading: { fontSize: 24, lineHeight: 32 },
  subtitle: { fontSize: 14, lineHeight: 22 },
  prayerPreview: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  prayerPreviewText: { fontSize: 15, lineHeight: 24 },
  label: { fontSize: 14, marginTop: 4 },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    fontSize: 16,
  },
  chips: { gap: 8, paddingRight: 4 },
  chip: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 100,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
  },
  chipText: { fontSize: 14 },
  errorBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 10,
  },
  errorText: { fontSize: 14 },
  signInBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  signInBtnText: { color: "#fff", fontSize: 14 },
  actions: {
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
  },
  cancelBtn: { borderWidth: 1.5 },
  submitBtn: {},
  actionBtnText: { fontSize: 15 },
});
