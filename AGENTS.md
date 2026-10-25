# Mynds App — Agent-Konventionen

Mental-Health-B2C-App (Expo + React Native + TypeScript). Projektordner von `~/Desktop/MYNDS`.

## Verbindliche Projektdokumente (vor jeder Änderung konsultieren)

- `../fragenkatalog-r1.md` — **Single Source of Truth** für alle Onboarding-Fragen. Änderungen: zuerst MD, dann `src/onboarding/catalog.ts` synchronisieren.
- `../planung-app-v1.md` — Architektur, Entscheidungen, Guardrails (v. a. Addendum E2: Screening ohne Auswertung, F10-Krisenkarte).
- `../Richtlinien.md` — DSGVO/MDR/AI-Act-Rahmen. Claims-Wortliste (§2.2) gilt auch für UI-Texte: niemals „behandeln/diagnostizieren/überwachen/riskieren".

## Harte Regeln

1. **Screening (Modul F):** kein Score, keine Ampel, keine Auswertung, keine KI-Verarbeitung der Antworten. F10-„Ja" zeigt ausschließlich die ruhige `CrisisCard`. Bis Fach-Review als Entwurf markiert.
2. **Keine Scheinimplementierungen:** Prototyp-Zustände sichtbar kennzeichnen (Muster: AccountScreen).
3. **Persistenz nur über `src/lib/storage.ts`** (Interface; aktuell AsyncStorage-Prototyp, später SQLCipher + Supabase EU).
4. **Designsystem:** nur Tokens aus `src/theme/tokens.ts`; KI-Kennzeichnung ausschließlich über `AiBadge` (Lavendel `colors.ai`).
5. Keine Gamification, keine Streaks, keine Schuld-Mechanik, kein Signalrot für Nutzerzustände.

## Technik

- Expo SDK 58, React 19, RN 0.88, TS 6 — Expo-APIs nie aus dem Gedächtnis, sondern aus `https://docs.expo.dev/versions/v58.0.0/` prüfen.
- Navigation: React Navigation (native-stack) — kein Expo Router (bewusste Entscheidung, siehe planung-app-v1.md §4).
- `npx expo install <pkg>` für neue Pakete; `npx tsc --noEmit` vor Abschluss jeder Aufgabe.

## Kommandos

```bash
npx expo start   # Dev-Server (Expo Go / Dev Build)
npx tsc --noEmit # Typecheck
```
