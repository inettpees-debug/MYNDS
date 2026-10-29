# MYNDS Brand Rule Book (v1.0)

> **Verbindliche Referenz** für alle MYNDS-Anwendungen (App, Landing-Page,
> Assets, Demos). Abgeleitet aus der beschlossenen Markenidentität
> („Brand Identity Variations Mynds“, Okt 2026 — Quelldokument liegt im
> Projektarchiv außerhalb des Repos). Dieses Rule Book ist die
> Single Source of Truth in Codeform; bei Konflikten gilt: Quelldokument >
> dieses Rule Book > Implementierung.
>
> Stand: 29.10.2026 · Status: **angewendet auf App + Landing-Page**

---

## 1. Markenkern

| Element | Wert |
|---|---|
| **Name** | mynds (Wortmarke immer kleingeschrieben: „mynds“) |
| **Slogan** | „Was geht dir gerade durch den Kopf?“ — die Frage, die mynds stellt |
| **Antwort-Motiv** | Auf die Frage folgt die Antwort „Nähe“ — mynds antwortet mit Nähe, nicht mit Auswertung |
| **Haltung** | Warm, ruhig, ehrlich, auf Augenhöhe. Kein Medizin-Look, kein Alarm, kein Gamification |
| **Kernversprechen** | Die Wartezeit auf Psychotherapie nutzbar machen — begleiten, strukturieren, sammeln |

**Sprache & Tonalität** (vollständig geregelt in `Richtlinien.md`, Kurzfassung):
- Erlaubt: *begleiten, strukturieren, sammeln, einordnen, vorbereiten*
- Verboten: *behandeln, diagnostizieren, überwachen, heilen, therapieren*
- Du-Anrede, ruhige Sätze, keine Dringlichkeit, keine Belohnungslogik.
- KI-Inhalte sind immer sichtbar gekennzeichnet (AiBadge).

**Nicht verhandelbar (klinische Guardrails, gehen vor Ästhetik):**
1. Screening (Modul F) = reine Selbstauskunft — keine Scores, Ampeln, Interpretationen.
2. F10 „Ja“ → nur die ruhige Krisenkarte (never blocking, never rot blinkend).
3. Krisenkarte bleibt visuell ruhig — sie nutzt **Blau** (Antwort/Nähe), nie Signal-Rot.
4. Keine Heilungs-/Diagnose-Versprechen in irgendeiner Optik.
5. Demos/Screenshots nur mit synthetischen Daten.

---

## 2. Visuelle Identität

### 2.1 Logo

- **Zeichen:** rundes, kleingeschriebenes **„m“** — schwer, geometrisch,
  sehr runde Strichenden (Outfit Bold). Kein Container, kein Punkt, keine
  Versalien.
- **Wortmarke:** „mynds“ — kleingeschrieben, Outfit Bold, eng laufend.
- **Lockup:** Zeichen links, Wortmarke rechts; oder Wortmarke allein.

| Untergrund | Zeichen/Wortmarke |
|---|---|
| Schwarz (Dark Mode) | Creme `#FCF5AF` |
| Blau `#0B4B8B` | Creme `#FCF5AF` |
| Creme `#FCF5AF` (Light Mode) | Schwarz `#000000` |
| Orange `#F0A533` | Schwarz `#000000` |

**Don'ts:** nie „MYNDS“ in Versalien als Wortmarke, kein Schatten, kein
Kontur-Outline, nicht strecken/quetschen, nicht auf Fotos ohne Abdunklung.

### 2.2 Farben (Kernpalette — nur diese sechs)

| Farbe | Hex | Name | Rolle |
|---|---|---|---|
| 🟡 | `#FCF5AF` | **Creme** | Light-Hintergrund · Dark-Logo/Primärtext |
| 🟠 | `#F0A533` | **Orange** | Primäre Aktionen, Wärme, Interaktion |
| 🟠 | `#E44F0A` | **Tieforange** | KI-Kennzeichnung (AiBadge), Vertiefung/Betonung |
| 🔴 | `#BA011A` | **Rot** | Frage-Impuls (Slogan-Blase) · destruktive Aktionen — **nie** Flächen für Nutzerzustände, nie Krisenkarte |
| 🔵 | `#0B4B8B` | **Blau** | Antwort/Nähe · App-Icon · sekundäre Flächen (Dark) · Hero-Band (Light) |
| ⚫ | `#000000` | **Schwarz** | Dark-Hintergrund · Light-Text |

**Zwei Modi (beide sind Marke):**
- **Light Mode** (Landing, Print): Hintergrund Creme, Text schwarz, Hero/Bänder Blau mit Creme-Schrift.
- **Dark Mode** (App): Hintergrund Schwarz + Grain, Text/Logo Creme, Karten in Blau-Tönen.

**Kontrast-Regeln (barrierefrei, WCAG AA):**
- Creme auf Schwarz: 18,6:1 ✓ · Orange auf Schwarz: 10,1:1 ✓ · Tieforange auf Schwarz: 5,4:1 ✓
- Blau `#0B4B8B` und Rot `#BA011A` sind **keine Textfarben auf Schwarz** (nur Flächen/Graphic).
- Schwarz auf Orange: 10,1:1 ✓ (Primärbutton) · Creme auf Blau: 7,8:1 ✓.

**Abgeleitete Töne** (Blau-/Creme-Abstufungen für UI-Hierarchie; dokumentiert,
damit niemand Hex-Werte erfindet — siehe §3.1 Token-Tabelle).

### 2.3 Typografie

| Einsatz | Schrift | Schnitte |
|---|---|---|
| Logo, Überschriften, Zahlen | **Outfit** | 500 Medium · 600 SemiBold · 700 Bold |
| Fließtext, UI, Formulare | **Albert Sans** | 400 Regular · 500 Medium · 600 SemiBold |

- Beide: Google Fonts, **SIL Open Font License** — bundeln erlaubt und
  DSGVO-empfohlen (lokal ausliefern, keine Requests an Google).
- App: gebündelt via `@expo-google-fonts/*` (kein Netzwerkzugriff).
- Landing: self-hosted WOFF2 in `landing/fonts/` (kein Google-Fonts-Link!).

### 2.4 Grain (Marken-Textur)

- Feines, monochromes Filmkorn auf **Schwarz-, Blau- und Rotflächen**
  („Den Grain in dieser Größe lassen!“ — sehr dezent, nicht vergröbern).
- Umsetzung: `grain.png` (256×256, kachelbar, Alpha ~6–8 % Overlay).
- Nie auf Creme-Flächen im Light Mode außer als ganz dezenter Gesamteffekt.

### 2.5 Formen, Illustration, App-Icon

- **Formen:** rund — Pillen (Radius 999), Karten 20 px, Buttons 14 px; keine
  harten Ecken außer bei reinen Textelementen.
- **Sprechblasen-Motiv:** Frage = roter Kreis (Slogan), Antwort = blaue/
  creme Pille („Nähe“). Nutzen für Hero, Onboarding-Momente, Marketing.
- **Illustration:** flach, freundlich, Landschaft (Himmel, Wolke, grüne
  Hügel) — nur ganze Szenen, keine Einzel-Icons im Mix mit UI-Icons.
- **App-Icon:** blaue Squircle `#0B4B8B` + cremes „m“ (Outfit Bold), zentriert.
  Android: `backgroundImage` Blau + `foregroundImage` „m“ (Safe Zone beachten) +
  Monochrome weiß. iOS: Vollfläche Blau (System mascht Ecken).

---

## 3. Design-System (Implementierung)

### 3.1 App-Tokens (`src/theme/tokens.ts`) — Dark Mode

| Token | Wert | Ableitung/Rolle |
|---|---|---|
| `bg` | `#000000` | Marken-Schwarz |
| `surface` | `#0A1F3D` | Karten — Blau 950 (abgeleitet aus `#0B4B8B`) |
| `surfaceAlt` | `#0B4B8B` | Sekundärflächen/Buttons — Marken-Blau (Antwort/Nähe) |
| `border` | `#204F80` | Blau 700 (abgeleitet) |
| `borderSoft` | `#17395F` | Blau 800 (abgeleitet) |
| `textPrimary` | `#FCF5AF` | Marken-Creme |
| `textSecondary` | `#CDC9A8` | Creme-Entsättigung (abgeleitet) |
| `textMuted` | `#8F8C74` | Creme-Entsättigung, dunkler (abgeleitet) |
| `accent` | `#F0A533` | Orange — primäre Aktionen |
| `accentDeep` | `#E44F0A` | Tieforange — Betonung/Fills (ValueBar, Switch-on) |
| `onAccent` | `#000000` | Text auf Orange/Primärbuttons |
| `ai` | `#E44F0A` | **KI-Kennzeichnung ausschließlich** (AiBadge, Prototyp-Hinweis) |
| `success` | `#FCF5AF` | Positive Bestätigung = Creme (ruhig, kein Grün-Erfinden) |
| `warning` | `#F0A533` | Hinweise (Speicherfehler-Banner, Validierung) = Orange |
| `danger` | `#BA011A` | Destruktive Aktionen — nur Flächen/Borders, nie Fließtext auf Schwarz |
| `track` | `#1B3E66` | Slider-/Progress-Track — Blau 750 (abgeleitet) |
| `fonts.heading.*` | Outfit 500/600/700 | Display, Title, Zahlen |
| `fonts.body.*` | Albert Sans 400/500/600 | Body, Caption, Buttons, Formulare |

### 3.2 Komponenten-Regeln (App)

- **Primärbutton:** Orange, schwarze Schrift. **Sekundärbutton:** Blau
  `surfaceAlt`, creme Schrift. **Ghost:** transparent, creme Sekundärtext.
- **Chips:** unverwählt dunkelblaue Fläche; gewählt Orange mit schwarzer Schrift.
- **Krisenkarte:** blaue linke Kante (`surfaceAlt`-Blau), creme Zahlen —
  bewusst **nicht** Rot (Ruhe vor Farbe).
- **AiBadge:** Pillen-Border + Text in `ai` (Tieforange) mit ⚙-Präfix — nur
  für automatisch erstellte/KI-nahen Inhalte, nirgends sonst.
- **Screen-Hintergrund:** Schwarz + `grain.png`-Overlay (opacity 0.06,
  `resizeMode: repeat`).

### 3.3 Landing-Page (Light Mode)

- Hintergrund Creme `#FCF5AF`, Text schwarz; Hero-Band + Footer-Band Blau
  `#0B4B8B` mit Creme-Schrift + Grain.
- Headings Outfit, Body Albert Sans (self-hosted WOFF2).
- Primär-CTA: Orange-Pille, schwarze Schrift. Ghost: schwarzer Rahmen.
- Sprechblasen-Motiv im Hero: rote Kreisblase mit Slogan (weiße Schrift),
  creme Antwort-Pille „Nähe“ (schwarze Schrift) auf dem Blau-Band.
- Telefon-Mockup zeigt den App-Dark-Mode (schwarz, blaue Karten, orange Fills).
- Krisen-Nummern bleiben sichtbar (Abgrenzungs-Sektion) — Pflicht, nicht Design-Option.

---

## 4. Inventar (wo was liegt)

| Artefakt | Pfad |
|---|---|
| App-Tokens | `src/theme/tokens.ts` |
| UI-Bausteine | `src/components/ui.tsx` (Wordmark: `src/screens/WelcomeScreen.tsx`) |
| App-Icon (iOS/Web) | `assets/icon.png` |
| Android Adaptive | `assets/android-icon-foreground/-background/-monochrome.png` |
| Splash | `assets/splash-icon.png` (+ `app.json` → `splash.backgroundColor: #000000`) |
| Favicon | `assets/favicon.png` |
| Grain-Textur | `assets/grain.png` (App) · `landing/grain.png` (Landing-Kopie) |
| Fonts (App) | via `@expo-google-fonts/outfit`, `@expo-google-fonts/albert-sans`, `expo-font` |
| Fonts (Landing) | `landing/fonts/outfit-var.woff2`, `landing/fonts/albertsans-var.woff2` |
| Landing-Page | `landing/index.html` |
| Lizenzhinweis Fonts | `LICENSE` (THIRD-PARTY NOTICE, SIL OFL 1.1) |

---

## 5. Austauschliste (Alt → Neu, Migration abgeschlossen)

| Alt (Prototyp 0.1) | Neu (Marke) |
|---|---|
| `bg #0B0F16` | `#000000` |
| `surface #131A24` | `#0A1F3D` |
| `surfaceAlt #1B2433` | `#0B4B8B` |
| `border #26334B` | `#204F80` |
| `borderSoft #1D2839` | `#17395F` |
| `textPrimary #F2F5F9` | `#FCF5AF` |
| `textSecondary #A9B4C6` | `#CDC9A8` |
| `textMuted #6D7889` | `#8F8C74` |
| `accent #7BE0C8` (Mint) | `#F0A533` (Orange) |
| `accentDeep #2FA98F` | `#E44F0A` |
| `onAccent #06251D` | `#000000` |
| `ai #B8A7F5` (Lavendel) | `#E44F0A` (Tieforange) |
| `success #7BCF95` | `#FCF5AF` |
| `warning #E8B85C` | `#F0A533` |
| `danger #E58E8E` | `#BA011A` |
| `track #223049` | `#1B3E66` |
| Systemfont (SF/Roboto) | Outfit + Albert Sans (gebündelt) |
| Wortmarke „M Y N D S“ (Versalien, gesperrt) | „mynds“ (Outfit Bold, kleingeschrieben) |
| Splash/Icon: Mint-„M“ auf `#0B0F16` | Creme-„m“ auf Blau `#0B4B8B` / Splash auf Schwarz |
| Landing: Dark/Mint | Light Mode (Creme/Schwarz/Blau) |

---

## 6. Entscheidungslogbuch

Vom Quelldokument nicht direkt vorgegeben, hier entschieden (begründet,
reversibel über Tokens):

1. **App bleibt Dark-first** (wie Marken-Dark-Mode); Landing = Light Mode.
   Beide Modi sind laut Quelldokument gleichwertige Marke. → Kein Theme-
   Provider nötig; Light-Theme der App bleibt spätere Option.
2. **AiBadge = Tieforange `#E44F0A`** (statt Lavendel):palette-fremdes
   Lavendel entfällt; Tieforange ist die zweitwarmeste Akzentfarbe und vom
   Primär-Orange unterscheidbar. Kontrast auf Schwarz: 5,4:1 ✓.
3. **Krisenkarte = blaue Kante statt Orange/Akzent**: Blau ist die
   „Antwort/Nähe“-Farbe — ruhigstes Element der Palette (Guardrail #3).
4. **`success` = Creme statt Grün**: Grün ist palette-fremd; positive
   Bestätigungen bleiben ruhig (keine Ampel-Logik in der App).
5. **Abgeleitete Blau-/Creme-Stufen** (§3.1 „abgeleitet“) für Flächen- und
   Text-Hierarchie — nötig, weil die Marke nur 6 Volltonfarben definiert.
   Nur über Tokens verwenden, keine neuen Hex-Werte im Code.
6. **Grain in der App als Overlay über dem Screen-Hintergrund** (nicht über
   Karten) — dezenter als im Print, damit Lesbarkeit/Performance sicher sind.
7. **Fonts gebündelt/self-hosted** (DSGVO, PEPP-Lessons): kein Request an
   fonts.googleapis.com von App oder Landing.

**Offene Punkte (Team-Entscheidung, nicht blockierend):**
- [ ] Illustrations-Stil für leere Zustände/Blog beauftragen oder weglassen?
- [ ] E-Mail-Signatur/Pitch-Deck-Vorlage nachziehen (gleiche Regeln).
- [ ] „Nähe“-Antwort-Motiv als Onboarding-Moment in der App (R2-Kandidat).

---

## 7. Implementierungsplan / -stand

| Schritt | Status |
|---|---|
| Rule Book (dieses Dokument) | ✅ v1.0 |
| Tokens umgestellt (§3.1) | ✅ |
| Fonts gebündelt + geladen (`App.tsx`, Splash hält bis geladen) | ✅ |
| UI-Bausteine auf Fonts/Grain umgestellt | ✅ |
| Wortmarke „mynds“ in App + Landing | ✅ |
| Krisenkarte auf Blau umgestellt | ✅ |
| Assets neu generiert (Icon/Splash/Android/Favicon/Grain) | ✅ |
| `app.json` (Splash schwarz, Adaptive-Icon blau) | ✅ |
| Landing Light Mode + self-hosted Fonts + Sprechblasen-Hero | ✅ |
| Verifikation: `tsc` + Jest (31 Tests) + `expo export -p web` | ✅ |
| Android-Preview-Build mit neuem Brand (EAS) | ⬜ auf Anforderung |

*Änderungen an dieser Datei = Markenänderungen — bitte im Team abstimmen.*
