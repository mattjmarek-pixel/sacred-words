const colors = {
  light: {
    // Core surfaces
    background: "#F8F7FF",
    foreground: "#1E1535",

    // Cards / elevated surfaces
    card: "#EEEAF8",
    cardForeground: "#1E1535",

    // Primary action color (candlelight gold)
    primary: "#D4883A",
    primaryForeground: "#1E1535",

    // Secondary (dusty rose / compassion)
    secondary: "#B87899",
    secondaryForeground: "#1E1535",

    // Muted
    muted: "#7B6E90",
    mutedForeground: "#7B6E90",

    // Accent (soft lavender blush)
    accent: "#EDE6F8",
    accentForeground: "#1E1535",

    // Destructive
    destructive: "#C0392B",
    destructiveForeground: "#FFFFFF",

    // Borders
    border: "#D8D2EE",
    input: "#D8D2EE",

    // Sacred Words specific
    warmBrown: "#2D1B69",     // deep indigo — headings, titles
    gold: "#D4883A",          // candlelight amber — primary action
    goldLight: "#FCEBD6",     // warm amber glow — chip bg, badge bg
    sage: "#B87899",          // dusty rose — secondary chips, badges
    sageLight: "#F7E8F0",     // soft blush — chip/badge backgrounds
    cream: "#F8F7FF",         // moonlit ivory — page background
    parchment: "#EEEAF8",     // indigo parchment — card background
    ink: "#1E1535",           // deep violet-black — body text
    shadow: "rgba(45, 27, 105, 0.10)",

    // Legacy
    text: "#1E1535",
    tint: "#D4883A",
  },
  dark: {
    // Core surfaces
    background: "#0D0A1A",
    foreground: "#EDE8FF",

    // Cards / elevated surfaces
    card: "#16102E",
    cardForeground: "#EDE8FF",

    // Primary action color (candlelight gold)
    primary: "#D4883A",
    primaryForeground: "#FFFFFF",

    // Secondary (soft rose)
    secondary: "#C47FA0",
    secondaryForeground: "#FFFFFF",

    // Muted
    muted: "#8B7FA8",
    mutedForeground: "#8B7FA8",

    // Accent (dark indigo glow)
    accent: "#231848",
    accentForeground: "#EDE8FF",

    // Destructive
    destructive: "#E05252",
    destructiveForeground: "#FFFFFF",

    // Borders
    border: "#2A1F4A",
    input: "#2A1F4A",

    // Sacred Words specific
    warmBrown: "#C8BFFF",     // moonlit lavender — headings in dark
    gold: "#D4883A",          // candlelight amber — same across modes
    goldLight: "#3D2515",     // dark amber glow — chip bg dark
    sage: "#C47FA0",          // soft rose — secondary in dark
    sageLight: "#2A1535",     // deep plum — badge/chip bg dark
    cream: "#0D0A1A",         // midnight — page background dark
    parchment: "#16102E",     // deep indigo — card background dark
    ink: "#EDE8FF",           // moonlit white — body text dark
    shadow: "rgba(0, 0, 0, 0.40)",

    // Legacy
    text: "#EDE8FF",
    tint: "#D4883A",
  },
  radius: 14,
};

export default colors;
