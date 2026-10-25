// Typen für Onboarding-Fragenkatalog und Antworten.
// Spiegel von /Users/inettpees/Desktop/MYNDS/fragenkatalog-r1.md (Single Source of Truth).

export type ModuleKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';

export type QuestionType =
  | 'info' // Nur Text + Weiter (Modul-Intros)
  | 'text'
  | 'textarea'
  | 'voice' // Sprach-First mit Text-Ersatz (Prototyp: Text, Sprache folgt R2)
  | 'single'
  | 'multi'
  | 'slider'
  | 'yesno' // Ja / Nein
  | 'yesnoskip' // Ja / Nein / "lieber nicht"
  | 'year'
  | 'ranking' // wichtigstes Element aus vorheriger Auswahl
  | 'ack'; // Bestätigung (Einwilligung/Info zur Kenntnis)

export type AnswerValue = string | number | boolean | string[] | null | undefined;

export interface AnswerRecord {
  value?: AnswerValue;
  /** Optionale Freitext-Ergänzung (z. B. Medikamentennamen bei E3). */
  note?: string;
  deferred?: boolean; // "Später beantworten"
  skipped?: boolean; // "lieber nicht beantworten"
  answeredAt: string; // ISO
}

export type Answers = Record<string, AnswerRecord>;

export interface Option {
  key: string;
  label: string;
}

export interface SliderConfig {
  min: number;
  max: number;
  defaultValue: number;
  minLabel: string;
  midLabel?: string;
  maxLabel: string;
  step?: number;
}

export interface QuestionDef {
  id: string;
  module: ModuleKey;
  screenLabel: string; // z. B. "S08"
  prompt: string;
  hint?: string;
  why?: string; // aufklappbar: "Warum fragen wir das?"
  type: QuestionType;
  options?: Option[];
  minSelection?: number;
  maxSelection?: number;
  slider?: SliderConfig;
  /** Pflichtangabe — ohne Antwort kein Weiter (nur für Minimalangaben). */
  required?: boolean;
  /** Pflicht, aber per "Später" vertagbar (z. B. Spontanbericht). */
  deferrable?: boolean;
  sensitivity?: 'normal' | 'high' | 'very-high' | 'maximum';
  /** F10-Regel: "Ja" löst sofort die ruhige Hilfekarte aus (planung-app-v1.md, E2.3). */
  crisisOnYes?: boolean;
  /** Bedingte Sichtbarkeit (Verzweigungslogik). */
  showIf?: (answers: Answers) => boolean;
  /** Zuordnung zu einer Tracking-Metric (metric_definitions.source_question_id). */
  metricKey?: string;
  /** Multi-Select: eigene Freitext-Einträge erlauben (D1 Ziele). */
  allowCustom?: boolean;
  /** YesNo: Bei "Ja" optionaler Freitext (E3/E4). */
  followUpText?: string;
  /** Ranking: Optionen dynamisch aus der Antwort einer anderen Frage ableiten (D2 ← D1). */
  optionsFromAnswer?: string;
  /** Ack: Beschriftung des Bestätigungs-Knopfes. */
  ackLabel?: string;
}

export interface ConsentRecord {
  scope: 'basis' | 'cloud_stt' | 'ai_support' | 'analytics';
  granted: boolean;
  policyVersion: string;
  changedAt: string;
}

export interface OnboardingState {
  startedAt: string;
  completedAt?: string;
  /** true, wenn dieser Stand aus synthetischen Demo-Daten geladen wurde. */
  isDemo?: boolean;
  answers: Answers;
  consents: ConsentRecord[];
  /** Module, deren Intro der Nutzer komplett übersprungen hat (E, F). */
  skippedModules: string[];
}
