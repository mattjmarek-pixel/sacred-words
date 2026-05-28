import { useTheme } from "@/lib/theme";
import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 *
 * Respects the user's manual appearance preference (System / Light / Dark)
 * set in Settings. Falls back to the device system setting when "System" is
 * chosen.
 */
export function useColors() {
  const { resolvedScheme } = useTheme();
  const palette = resolvedScheme === "dark" ? colors.dark : colors.light;
  return { ...palette, radius: colors.radius };
}
