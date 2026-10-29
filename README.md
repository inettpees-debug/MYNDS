# MYNDS
This is the code behind MYNDS. Our own Start-Up in context of S2B at WHU.

> Prototyp-Status (R1) — die App begleitet Menschen in der Therapie-Wartezeit.
> Sie ist keine Therapie, stellt keine Diagnosen und ersetzt keine Fachpersonen.

Mobile App (iOS/Android), Expo + React Native + TypeScript. Projektübergreifende
Dokumentation (Planung, Fragenkatalog, Compliance) liegt außerhalb dieses Repositories.
Marken-Identität (Farben, Typografie, Logo-Regeln): [`docs/brand/brand-identity-guide.md`](docs/brand/brand-identity-guide.md).

## Setup

```bash
npm install
npx expo start          # Expo Go auf dem Gerät scannen oder iOS-Simulator
npx tsc --noEmit        # Typecheck
```

## Status — ehrlich gekennzeichnet (Regel: keine Scheinimplementierung)

| Baustein | Status |
|---|---|
| Designsystem (Marken-Dark-Mode: Schwarz/Creme/Orange/Blau + Grain, Outfit/Albert Sans — Regelwerk `docs/brand/`) | ✅ produktionsnah |
| Onboarding-Flow S01–S18 (datengetrieben aus `src/onboarding/catalog.ts`) | ✅ lauffähiger Prototyp |
| Granulare Einwilligungen (Basis + 3 optionale) | ✅ lauffähig · **Texte ehrlich korrigiert** (kein Verschlüsselungs-/Widerruf-Versprechen über den Ist-Zustand hinaus) · anwaltliche Textprüfung offen |
| Sicherheitsrahmen + Krisenkarte (116117, Telefonseelsorge, 112) | ✅ lauffähig · F10-Trigger durch Tests abgesichert |
| Screening-Modul F (Selbstauskunft, keine Auswertung) | ⚠️ Prototyp — **FACHREVIEW OFFEN** vor jeder Beta · Skip-Semantik („lieber nicht") jetzt eindeutig gespeichert |
| Autosave/Resume (AsyncStorage-Prototyp) | ✅ getestet (Restore, Reset-Determinismus, Speicherfehler-Banner mit Retry) — Produktionspfad: verschlüsseltes SQLite, **Konzept folgt separat** |
| Antworten-Bearbeitung (Slider-Restore, eigene Ziele, D2-Priorisierung) | ✅ getestet — Audit-Bugs P0-2/3/4, P1-5 behoben |
| Zusammenfassung & Korrektur | ✅ lauffähig (dynamische Labels inkl. eigener Ziele) |
| Dashboard (ehrliches Profil: Anliegen, Ziele/Top-Ziel, Startbild-Werte, Symptom-Check nur als Zählung, Krisen-Nummern, Datenkontrolle) | ✅ lauffähig · zeigt nur vorhandene Daten, keine Scores/Ampeln |
| Demo-Modus („Demo-Profil laden": synthetisches Beispielprofil für Pitch/Demos — F10 bewusst „Nein") | ✅ lauffähig · nur synthetische Daten, nie echte |
| Account (Apple/Google) | 🎭 **Mock** — echte Auth folgt mit Backend-Integration |
| Spracheingabe C1 | 🎭 Platzhalter — Aufnahme/Transkription ist Release 2 · **Mikrofon-Berechtigungen bis dahin entfernt** |
| Check-in/Tracking, Praxis-Report, Mindmaps | Release 2/3 (Roadmap planung-app-v1.md §9) |

## Tests

```bash
npm test            # 31 Tests (jest-expo + @testing-library/react-native v14)
npx tsc --noEmit    # Typecheck
```

Abgedeckt: Verzweigungslogik (B2/D2/G2_*, Modul-Skip) · Slider-Restore · YesNoSkip-Skip-Flag
inkl. Wiederöffnen · D2-Optionen aus D1 (inkl. eigener Ziele) · eigene Ziele sichtbar/abwählbar ·
F10-Krisenkarte (Ja→Hilfe, ohne Blockieren) · Autosave/Restore · Speicher-/Ladefehler-Banner ·
Retry · deterministischer Reset · Demo-Daten (synthetisch, F10 „Nein"). — **Nicht** abgedeckt:
echtes Gerät/Expo Go, Screenreader, App-Kill-Resume (manuell prüfen).

> Hinweis Test-Stack: RNTL v14 benötigt `await render(...)` + `screen`-Queries und
> `userEvent.press` statt `fireEvent.press` (letzteres greift bei Pressables nicht zuverlässig).

## Struktur

```
src/
  theme/tokens.ts          Designsystem (Marken-Farben, Outfit/Albert Sans, Spacing, Radius)
  components/ui.tsx        Wiederverwendbare Bausteine inkl. CrisisCard, AiBadge, Grain-Screen
  components/StorageBanner.tsx  Sichtbarer Hinweis bei Speicher-/Ladefehlern (mit Retry)
  navigation/              Stack-Navigation
  onboarding/
    types.ts               Frage-/Antwort-/Consent-Typen
    catalog.ts             Fragenkatalog R1 (Spiegel von fragekatalog-r1.md)
    state.tsx              Context+Reducer, Autosave, Resume
    demoData.ts            Synthetisches Demo-Profil (Pitch — nie echte Daten)
  screens/                 Welcome, Account(Mock), Consent, Safety, Question(Engine), Summary, Dashboard
  lib/storage.ts           Persistenz-Abstraktion (AsyncStorage → später SQLite/Supabase)
assets/                    Marken-Assets (Icon, Splash, Android-Adaptive, Favicon, grain.png)
docs/brand/                Brand Rule Book (verbindliche Marken-Referenz)
landing/                   Statische Landing-Page (Light Mode der Marke, self-hosted Fonts)
```

## Deployment

- **Landing-Page**: Netlify (GitHub-verbunden) — jeder Push auf `main` deploys `landing/`
  automatisch (`netlify.toml`: kein Build-Step, Publish-Dir `landing/`).
- **App-Builds**: EAS-Projekt `@mynds/mynds` — Profil `preview` = interne APK-Verteilung
  (`eas.json`); Store-Beta (TestFlight/Play Console) erst nach Apple-Developer-Konto bzw.
  Play-Console und den P1-Fixes (Verschlüsselung, Consent-Widerruf, Export).

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
5. App-Icons/Splash folgen der Marken-Identität (generiert; feiner Schliff ggf. nach Design-Review).
6. Gerätetests (Expo Go, App-Kill-Resume, echte Tastatur) in dieser Umgebung nicht möglich — manuell nachholen.
