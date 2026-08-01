export const theme = {
  colors: {
    bg: "#F8F4EE",
    card: "#FFFCF8",
    cardSoft: "#F3EFE8",
    text: "#2E2A26",
    textSecondary: "#746E68",
    textMuted: "#A39C92",
    divider: "#E8E0D5",
    border: "#ECE5DA",
    green: "#788567",
    terracotta: "#C88A6C",
    mustard: "#CFB06D",
    lake: "#8AA8BD",
  },
  spacing: {
    s1: 4,
    s2: 8,
    s3: 12,
    s4: 16,
    s5: 20,
    s6: 24,
    s8: 32,
    s10: 40,
  },
  radius: {
    card: 28,
    button: 18,
    search: 22,
    chip: 999,
    avatar: 999,
  },
  shadow: {
    card: "0 12px 32px rgba(0,0,0,0.05)",
    soft: "0 6px 20px rgba(0,0,0,0.04)",
    lift: "0 18px 40px rgba(0,0,0,0.08)",
  },
} as const;

export type Theme = typeof theme;