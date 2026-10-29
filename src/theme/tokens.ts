// MYNDS Design-Tokens — Marken-Identität „Brand Identity Variations Mynds“ (Okt 2026).
// Verbindliche Referenz: docs/brand/brand-identity-guide.md (Rule Book v1.0).
// App = Dark Mode der Marke (Schwarz + Grain, Creme-Text, Orange-Aktionen, Blau-Flächen).
// Light-Mode-Strategie: spätere Erweiterung via Theme-Provider (Tokens semantisch benannt).

export const colors = {
  // Flächen (Blau-Abstufungen aus Marken-Blau #0B4B8B abgeleitet — nur hier pflegen)
  bg: '#000000',
  surface: '#0A1F3D',
  surfaceAlt: '#0B4B8B', // Marken-Blau — „Antwort/Nähe“
  border: '#204F80',
  borderSoft: '#17395F',

  // Text (Creme-Abstufungen aus Marken-Creme #FCF5AF)
  textPrimary: '#FCF5AF',
  textSecondary: '#CDC9A8',
  textMuted: '#8F8C74',

  // Akzente
  accent: '#F0A533', // Marken-Orange — primäre Aktionen
  accentDeep: '#E44F0A', // Tieforange — Betonung/Fills
  onAccent: '#000000',
  ai: '#E44F0A', // Tieforange — ausschließlich für KI-generierte/kennzeichnete Inhalte

  // Semantik (sparsam, nie für Nutzerzustände; kein Grün-Erfinden — s. Rule Book §6)
  success: '#FCF5AF',
  warning: '#F0A533',
  danger: '#BA011A', // nur Flächen/Borders — kein Fließtext auf Schwarz (Kontrast)

  // Slider/Tracks
  track: '#1B3E66',
} as const;

export const spacing = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32, xxxl: 48 } as const;

export const radius = { sm: 10, md: 14, lg: 20, pill: 999 } as const;

// Schriften (Outfit = Logo/Überschriften, Albert Sans = Fließtext/UI — gebündelt, DSGVO-sauber)
export const fonts = {
  heading: {
    medium: 'Outfit_500Medium',
    semibold: 'Outfit_600SemiBold',
    bold: 'Outfit_700Bold',
  },
  body: {
    regular: 'AlbertSans_400Regular',
    medium: 'AlbertSans_500Medium',
    semibold: 'AlbertSans_600SemiBold',
  },
} as const;

// Typografie (Dynamic Type über RN-Defaults aktiv)
export const type = {
  display: { fontSize: 30, fontWeight: '700' as const, fontFamily: fonts.heading.bold, lineHeight: 38 },
  title: { fontSize: 22, fontWeight: '600' as const, fontFamily: fonts.heading.semibold, lineHeight: 29 },
  body: { fontSize: 16, fontWeight: '400' as const, fontFamily: fonts.body.regular, lineHeight: 23 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, fontFamily: fonts.body.regular, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400' as const, fontFamily: fonts.body.regular, lineHeight: 18 },
} as const;
