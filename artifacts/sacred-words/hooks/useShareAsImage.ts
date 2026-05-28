import { useRef, useCallback, useState } from "react";
import { Platform, Alert } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import type { View } from "react-native";

interface ShareAsImageOptions {
  title: string;
  onSaveSuccess?: () => void;
  onSaveError?: (err: unknown) => void;
}

export function useShareAsImage() {
  const cardRef = useRef<View>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureCard = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      const uri = await captureRef(cardRef, {
        format: "png",
        quality: 1,
        result: "tmpfile",
      });
      return uri;
    } catch {
      return null;
    }
  }, []);

  const shareAsImage = useCallback(
    async ({ title, onSaveError }: ShareAsImageOptions) => {
      if (Platform.OS === "web") {
        Alert.alert(
          "Mobile only",
          "Open Sacred Words in the iOS or Android app to share a prayer as an image."
        );
        return;
      }

      setIsCapturing(true);
      try {
        const uri = await captureCard();
        if (!uri) {
          Alert.alert("Could not capture image", "Please try again.");
          return;
        }

        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
          Alert.alert("Not available", "Sharing is not available on this device.");
          return;
        }

        await Sharing.shareAsync(uri, {
          mimeType: "image/png",
          dialogTitle: title,
          UTI: "public.png",
        });
      } catch (err) {
        onSaveError?.(err);
      } finally {
        setIsCapturing(false);
      }
    },
    [captureCard]
  );

  const saveToLibrary = useCallback(
    async ({ title, onSaveSuccess, onSaveError }: ShareAsImageOptions) => {
      if (Platform.OS === "web") {
        Alert.alert(
          "Mobile only",
          "Open Sacred Words in the iOS or Android app to save a prayer image to your camera roll."
        );
        return;
      }

      setIsCapturing(true);
      try {
        const uri = await captureCard();
        if (!uri) {
          Alert.alert("Could not capture image", "Please try again.");
          return;
        }

        const MediaLibrary = await import("expo-media-library");
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "Please allow Sacred Words to save photos to your library."
          );
          return;
        }

        await MediaLibrary.saveToLibraryAsync(uri);
        onSaveSuccess?.();
      } catch (err) {
        onSaveError?.(err);
      } finally {
        setIsCapturing(false);
      }
    },
    [captureCard]
  );

  return { cardRef, isCapturing, shareAsImage, saveToLibrary };
}
