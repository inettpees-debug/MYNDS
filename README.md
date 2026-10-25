# Mynds — App (Prototyp R1)

Mobile App (iOS/Android) für die Wartezeit-Begleitung von Menschen vor Psychotherapie.
Elternordner: `~/Desktop/MYNDS` — dort liegen Planung (`planung-app-v1.md`), Fragenkatalog
(`fragenkatalog-r1.md`) und Compliance-Rahmen (`Richtlinien.md`).

## Setup

```bash
npm install
npx expo start          # Expo Go auf dem Gerät scannen oder iOS-Simulator
npx tsc --noEmit        # Typecheck
```

## Status — ehrlich gekennzeichnet (Regel: keine Scheinimplementierung)

| Baustein | Status |
|---|---|
| Designsystem (Dark-Mode-Tokens, Buttons, Chips, Slider mit Wortankern, Cards, Progress) | ✅ produktionsnah |
| Onboarding-Flow S01–S18 (datengetrieben aus `src/onboarding/catalog.ts`) | ✅ lauffähiger Prototyp |
| Granulare Einwilligungen (Basis + 3 optionale) | ✅ lauffähig · **Texte ehrlich korrigiert** (kein Verschlüsselungs-/Widerruf-Versprechen über den Ist-Zustand hinaus) · anwaltliche Textprüfung offen |
| Sicherheitsrahmen + Krisenkarte (116117, Telefonseelsorge, 112) | ✅ lauffähig · F10-Trigger durch Tests abgesichert |
| Screening-Modul F (Selbstauskunft, keine Auswertung) | ⚠️ Prototyp — **FACHREVIEW OFFEN** vor jeder Beta · Skip-Semantik („lieber nicht") jetzt eindeutig gespeichert |
| Autosave/Resume (AsyncStorage-Prototyp) | ✅ getestet (Restore, Reset-Determinismus, Speicherfehler-Banner mit Retry) — Produktionspfad: verschlüsseltes SQLite, **Konzept folgt separat** |
| Antworten-Bearbeitung (Slider-Restore, eigene Ziele, D2-Priorisierung) | ✅ getestet — Audit-Bugs P0-2/3/4, P1-5 behoben |
| Zusammenfassung & Korrektur | ✅ lauffähig (dynamische Labels inkl. eigener Ziele) |
| Dashboard | Platzhalter; Datenschutz-Karte ehrlich gelabelt („Technische Datenansicht (gekürzt)") |
| Account (Apple/Google) | 🎭 **Mock** — echte Auth folgt mit Backend-Integration |
| Spracheingabe C1 | 🎭 Platzhalter — Aufnahme/Transkription ist Release 2 · **Mikrofon-Berechtigungen bis dahin entfernt** |
| Check-in/Tracking, Praxis-Report, Mindmaps | Release 2/3 (Roadmap planung-app-v1.md §9) |

## Tests

```bash
npm test            # 26 Tests (jest-expo + @testing-library/react-native v14)
npx tsc --noEmit    # Typecheck
```

Abgedeckt: Verzweigungslogik (B2/D2/G2_*, Modul-Skip) · Slider-Restore · YesNoSkip-Skip-Flag
inkl. Wiederöffnen · D2-Optionen aus D1 (inkl. eigener Ziele) · eigene Ziele sichtbar/abwählbar ·
F10-Krisenkarte (Ja→Hilfe, ohne Blockieren) · Autosave/Restore · Speicher-/Ladefehler-Banner ·
Retry · deterministischer Reset. — **Nicht** abgedeckt: echtes Gerät/Expo Go, Screenreader,
App-Kill-Resume (manuell prüfen).

> Hinweis Test-Stack: RNTL v14 benötigt `await render(...)` + `screen`-Queries und
> `userEvent.press` statt `fireEvent.press` (letzteres greift bei Pressables nicht zuverlässig).

## Struktur

```
src/
  theme/tokens.ts          Designsystem (Farben, Typo, Spacing, Radius)
  components/ui.tsx        Wiederverwendbare Bausteine inkl. CrisisCard, AiBadge
  navigation/              Stack-Navigation
  onboarding/
    types.ts               Frage-/Antwort-/Consent-Typen
    catalog.ts             Fragenkatalog R1 (Spiegel von fragekatalog-r1.md)
    state.tsx              Context+Reducer, Autosave, Resume
  screens/                 Welcome, Account(Mock), Consent, Safety, Question(Engine), Summary, Dashboard
  lib/storage.ts           Persistenz-Abstraktion (AsyncStorage → später SQLite/Supabase)
```

## Verzweigungs-Logik (Flow)

B → C → D → G (Baseline) → F (Symptom-Check, freiwillig) → E (Medizin, freiwillig) → H.
Sensible Module bewusst **nach** dem Wertaufbau — Muster der Quell-PDFs (Sand/Krengel:
Screening-Items am Bogenende). `showIf`-Bedingungen steuern dynamische Folgefragen
(B2 Termin, D2 Priorisierung, G2_* je gewählter Tracking-Variable).

## Bekannte Einschränkungen

1. Modul F muss vor jeder Beta fachlich (Psycholog:in/Psychotherapeut:in) und im Claims-Check geprüft werden.
2. AsyncStorage speichert unverschlüsselt und liegt standardmäßig in Geräte-Backups — Übergangszustand bis zur Produktions-Speicherarchitektur (Konzept: `../konzept-speicher-einwilligung-v1.md`, Umsetzung erst nach Freigabe).
3. B2 (Termin) als Freitext — nativer Date-Picker folgt.
4. Accessibility: Grundlagen (Roles/Labels/Hints) gesetzt; vollständiger Screenreader-Test ausstehend (nicht automatisiert prüfbar).
5. App-Icons/Splash sind noch Expo-Defaults (Branding folgt).
6. Gerätetests (Expo Go, App-Kill-Resume, echte Tastatur) in dieser Umgebung nicht möglich — manuell nachholen.
