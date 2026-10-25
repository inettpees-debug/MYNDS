// MYNDS Design-Tokens — Dark Mode (primär), WHOOP-orientierte Informationsdichte
// ohne Übernahme geschützter WHOOP-Designelemente. Light-Mode-Strategie: spätere
// Erweiterung via Theme-Provider (tokens sind bereits semantisch benannt).

export const colors = {
  // Flächen
  bg: '#0B0F16',
  surface: '#131A24',
  surfaceAlt: '#1B2433',
  border: '#26334B',
  borderSoft: '#1D2839',

  // Text
  textPrimary: '#F2F5F9',
  textSecondary: '#A9B4C6',
  textMuted: '#6D7889',

  // Akzente
  accent: '#7BE0C8', // Mint — primäre Aktionen
  accentDeep: '#2FA98F',
  onAccent: '#06251D',
  ai: '#B8A7F5', // Lavendel — ausschließlich für KI-generierte/kennzeichnete Inhalte

  // Semantik (sparsam, nie für Nutzerzustände)
  success: '#7BCF95',
  warning: '#E8B85C',
  danger: '#E58E8E', // ruhig, kein Signalrot

  // Slider
  track: '#223049',
} as const;

export const spacing = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;

// Typografie (Systemfont: SF Pro / Roboto — Dynamic Type über RN-Defaults aktiv)
export const type = {
  display: { fontSize: 30, fontWeight: '700' as const, lineHeight: 38 },
  title: { fontSize: 22, fontWeight: '600' as const, lineHeight: 29 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 23 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
} as const;
