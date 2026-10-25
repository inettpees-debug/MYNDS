// MYNDS Onboarding-Fragenkatalog R1 — Code-Abbild von fragekatalog-r1.md.
// Reihenfolge des Flows: B → C → D → G → F → E → H
// (sensible Module bewusst NACH Wertaufbau, Muster der Vorlagen Sand/Krengel:
//  Screening-Items stehen dort am Ende des Bogens.)
// Änderungen: IMMER zuerst im MD-Dokument, dann hier synchronisieren.

import { Option, QuestionDef, ModuleKey } from './types';

export const moduleMeta: Record<ModuleKey, { title: string; optional?: boolean }> = {
  A: { title: 'Willkommen' },
  B: { title: 'Kontext' },
  C: { title: 'Dein Anliegen' },
  D: { title: 'Ziele & Ressourcen' },
  E: { title: 'Medizinischer Kontext', optional: true },
  F: { title: 'Symptom-Check', optional: true },
  G: { title: 'Dein Tracking' },
  H: { title: 'Abschluss' },
};

const rel = (answers: import('./types').Answers, id: string) => answers[id];

/** Prüft, ob in einer Multi-Select-Antwort ein Schlüssel gewählt wurde. */
const isSel = (answers: import('./types').Answers, id: string, key: string): boolean => {
  const v = answers[id]?.value;
  return Array.isArray(v) && v.includes(key);
};

export const catalog: QuestionDef[] = [
  // ─── Modul B — Kontext & Profil ───────────────────────────────────────────
  {
    id: 'B1',
    module: 'B',
    screenLabel: 'S06',
    prompt: 'Wo stehst du gerade?',
    hint: 'Das personalisiert deine Startseite — nichts wird weitergegeben.',
    type: 'single',
    required: true,
    options: [
      { key: 'waiting', label: 'Ich warte auf einen Therapieplatz' },
      { key: 'appointment', label: 'Ich habe schon einen Termin' },
      { key: 'in_therapy', label: 'Ich bin schon in Therapie' },
      { key: 'self_care', label: 'Ich begleite meine Psyche einfach' },
    ],
  },
  {
    id: 'B2',
    module: 'B',
    screenLabel: 'S06',
    prompt: 'Hast du schon ein Datum für ein Erst- oder Folgespräch?',
    hint: 'Optional. Wir bestätigen und buchen keine Termine — wir erinnern dich nur.',
    why: 'Mit dem Datum kannst du Gedanken und Fragen gezielt für diesen Tag sammeln.',
    type: 'text', // Prototyp: Freitext-Datum; nativer Date-Picker folgt mit R1-Feinschliff
    showIf: (a) => {
      const v = rel(a, 'B1')?.value;
      return v === 'waiting' || v === 'appointment' || v === 'in_therapy';
    },
  },
  {
    id: 'B3',
    module: 'B',
    screenLabel: 'S07',
    prompt: 'Wie möchtest du genannt werden?',
    hint: 'Ein Rufname genügt — Nachnamen brauchen wir nicht.',
    type: 'text',
  },
  {
    id: 'B4',
    module: 'B',
    screenLabel: 'S07',
    prompt: 'In welchem Jahr bist du geboren?',
    hint: 'Nur das Jahr — für deinen Kontext und weil Mynds für Erwachsene ist.',
    type: 'year',
    required: true,
  },
  {
    id: 'B5',
    module: 'B',
    screenLabel: 'S07',
    prompt: 'Welche Sprache soll Mynds sprechen?',
    type: 'single',
    required: true,
    options: [
      { key: 'de', label: 'Deutsch' },
      { key: 'en', label: 'English' },
    ],
  },

  // ─── Modul C — Aktuelles Anliegen (Herzstück 1) ───────────────────────────
  {
    id: 'C1',
    module: 'C',
    screenLabel: 'S08',
    prompt: 'Erzähl in eigenen Worten, was dich gerade beschäftigt.',
    hint: 'Nimm dir 1–3 Minuten — du musst nicht strukturiert reden.',
    why: 'Deine eigenen Worte sind der wichtigste Inhalt deines Profils und — wenn du möchtest — deines Berichts für die Praxis.',
    type: 'voice',
    required: true,
    deferrable: true,
    sensitivity: 'very-high',
  },
  {
    id: 'C2',
    module: 'C',
    screenLabel: 'S09',
    prompt: 'Seit wann beschäftigt dich das?',
    type: 'single',
    options: [
      { key: 'weeks', label: 'seit wenigen Wochen' },
      { key: 'months', label: 'seit einigen Monaten' },
      { key: 'half_year', label: 'seit etwa einem halben Jahr' },
      { key: 'year_plus', label: 'seit über einem Jahr' },
      { key: 'long', label: 'das begleitet mich schon sehr lange' },
    ],
  },
  {
    id: 'C3',
    module: 'C',
    screenLabel: 'S09',
    prompt: 'Wie oft ist es gegenwärtig?',
    type: 'single',
    options: [
      { key: 'daily', label: 'fast täglich' },
      { key: 'weekly_plus', label: 'mehrmals pro Woche' },
      { key: 'weekly', label: 'etwa wöchentlich' },
      { key: 'rarer', label: 'seltener' },
      { key: 'fluctuating', label: 'es schwankt stark' },
    ],
  },
  {
    id: 'C4',
    module: 'C',
    screenLabel: 'S09',
    prompt: 'Wie belastend ist es für dich — gerade jetzt?',
    type: 'slider',
    metricKey: 'subjective_burden',
    slider: {
      min: 1,
      max: 10,
      defaultValue: 5,
      minLabel: 'leicht störend',
      midLabel: 'deutlich belastend',
      maxLabel: 'unerträglich',
    },
  },
  {
    id: 'C5',
    module: 'C',
    screenLabel: 'S10',
    prompt: 'Wo macht es sich im Alltag bemerkbar?',
    hint: 'Mehrfachauswahl — gern alles, was zutrifft.',
    type: 'multi',
    options: [
      { key: 'work', label: 'Arbeit / Studium' },
      { key: 'sleep', label: 'Schlaf' },
      { key: 'relationships', label: 'Beziehungen' },
      { key: 'leisure', label: 'Freizeit' },
      { key: 'body', label: 'Körper' },
      { key: 'self_worth', label: 'Selbstwert' },
      { key: 'everywhere', label: 'fast überall' },
    ],
  },
  {
    id: 'C6',
    module: 'C',
    screenLabel: 'S10',
    prompt: 'Was macht es besser — und was schlimmer?',
    hint: 'Ein Stichwort pro Zeile genügt.',
    type: 'textarea',
  },
  {
    id: 'C7',
    module: 'C',
    screenLabel: 'S11',
    prompt: 'Was hast du schon versucht, um damit umzugehen?',
    hint: 'Hilft deiner Therapeut:in, dort anzusetzen, wo du schon stehst.',
    type: 'multi',
    options: [
      { key: 'talks', label: 'Gespräche mit Nahestehenden' },
      { key: 'movement', label: 'Bewegung / Sport' },
      { key: 'mindfulness', label: 'Achtsamkeit / Entspannung' },
      { key: 'self_help', label: 'Selbsthilfe-Bücher / Podcasts' },
      { key: 'apps', label: 'Apps' },
      { key: 'professional', label: 'Professionelle Hilfe' },
      { key: 'nothing_yet', label: '(noch) nichts' },
    ],
  },

  // ─── Modul D — Therapieziele & Ressourcen (Herzstück 2) ───────────────────
  {
    id: 'D1',
    module: 'D',
    screenLabel: 'S12',
    prompt: 'Was möchtest du erreichen?',
    hint: 'Bis zu 3 Ziele — eigene Worte oder Vorschläge.',
    why: 'Ziele geben dir und deiner Therapeut:in eine gemeinsame Richtung. Du kannst sie jederzeit ändern.',
    type: 'multi',
    required: true,
    deferrable: true,
    minSelection: 1,
    maxSelection: 3,
    allowCustom: true,
    options: [
      { key: 'sleep_calm', label: 'ruhiger schlafen' },
      { key: 'boundaries', label: 'klarer Grenzen setzen' },
      { key: 'energy', label: 'mehr Energie im Alltag' },
      { key: 'anxiety', label: 'Ängste besser aushalten' },
      { key: 'self_worth', label: 'Selbstwert stärken' },
      { key: 'openness', label: 'offener über Gefühle sprechen' },
    ],
  },
  {
    id: 'D2',
    module: 'D',
    screenLabel: 'S12',
    prompt: 'Welches Ziel ist dir am wichtigsten?',
    hint: 'Wähle eins aus — die Reihenfolge kannst du später anpassen.',
    type: 'ranking',
    optionsFromAnswer: 'D1',
    showIf: (a) => {
      const v = rel(a, 'D1')?.value;
      return Array.isArray(v) && v.length > 1;
    },
  },
  {
    id: 'D3',
    module: 'D',
    screenLabel: 'S12',
    prompt: 'Welche Gefühle oder Verhaltensweisen würdest du gern besser verstehen?',
    type: 'textarea',
  },
  {
    id: 'D4',
    module: 'D',
    screenLabel: 'S13',
    prompt: 'Was braucht die Zusammenarbeit mit einer Therapeut:in, damit sie dir guttut?',
    type: 'multi',
    options: [
      { key: 'listening', label: 'gut zuhören' },
      { key: 'honesty', label: 'ehrliches Feedback' },
      { key: 'structure', label: 'Struktur & Methoden' },
      { key: 'time', label: 'Zeit für meine Themen' },
      { key: 'patience', label: 'Geduld' },
      { key: 'humor', label: 'Humor' },
    ],
  },
  {
    id: 'D5',
    module: 'D',
    screenLabel: 'S13',
    prompt: 'Was sollte in der Therapie auf keinen Fall passieren?',
    hint: 'Optional — aber wertvoll für das erste Gespräch.',
    type: 'textarea',
    sensitivity: 'high',
  },
  {
    id: 'D6',
    module: 'D',
    screenLabel: 'S13',
    prompt: 'Was sind deine Stärken?',
    hint: 'Was auch immer dir einfällt — es muss nicht bescheiden sein.',
    type: 'multi',
    options: [
      { key: 'persistent', label: 'ausdauernd' },
      { key: 'empathic', label: 'empathisch' },
      { key: 'curious', label: 'neugierig' },
      { key: 'creative', label: 'kreativ' },
      { key: 'loyal', label: 'loyal' },
      { key: 'disciplined', label: 'diszipliniert' },
      { key: 'humorous', label: 'humorvoll' },
      { key: 'analytical', label: 'analytisch' },
      { key: 'warm', label: 'warmherzig' },
      { key: 'brave', label: 'mutig' },
    ],
  },
  {
    id: 'D7',
    module: 'D',
    screenLabel: 'S13',
    prompt: 'Wer oder was unterstützt dich gerade?',
    type: 'multi',
    options: [
      { key: 'partner', label: 'Partner:in' },
      { key: 'family', label: 'Familie' },
      { key: 'friends', label: 'Freund:innen' },
      { key: 'colleagues', label: 'Kolleg:innen' },
      { key: 'pet', label: 'Haustier' },
      { key: 'group', label: 'Selbsthilfegruppe' },
      { key: 'no_one', label: 'niemand im Moment' },
    ],
  },
  {
    id: 'D8',
    module: 'D',
    screenLabel: 'S13',
    prompt: 'Was tut dir gut — auch in schwierigen Zeiten?',
    type: 'textarea',
  },

  // ─── Modul G — Baseline & Tracking-Setup (vor den sensiblen Modulen) ──────
  {
    id: 'G1',
    module: 'G',
    screenLabel: 'S14',
    prompt: 'Was möchtest du begleiten?',
    hint: 'Die ersten vier sind bereits passend zu deinem Anliegen gesetzt. Du kannst jederzeit ändern — weniger ist mehr.',
    type: 'multi',
    required: true,
    minSelection: 1,
    options: [
      { key: 'mood', label: 'Stimmung' },
      { key: 'energy', label: 'Energie' },
      { key: 'sleep', label: 'Schlaf' },
      { key: 'tension', label: 'Anspannung / Ängste' },
      { key: 'stress', label: 'Stress' },
      { key: 'social', label: 'Soziale Kontakte' },
      { key: 'movement', label: 'Bewegung' },
      { key: 'caffeine', label: 'Koffein' },
      { key: 'alcohol', label: 'Alkohol' },
    ],
  },
  {
    id: 'G2_mood',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie ist deine Stimmung heute?',
    type: 'slider',
    metricKey: 'mood',
    showIf: (a) => isSel(a, 'G1', 'mood'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'sehr schlecht', midLabel: 'okay', maxLabel: 'sehr gut' },
  },
  {
    id: 'G2_energy',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie ist deine Energie heute?',
    type: 'slider',
    metricKey: 'energy',
    showIf: (a) => isSel(a, 'G1', 'energy'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'keine Energie', midLabel: 'mittel', maxLabel: 'volle Energie' },
  },
  {
    id: 'G2_sleep',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie gut hast du in den letzten Nächten geschlafen?',
    type: 'slider',
    metricKey: 'sleep_quality',
    showIf: (a) => isSel(a, 'G1', 'sleep'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'sehr schlecht', midLabel: 'mittel', maxLabel: 'sehr gut' },
  },
  {
    id: 'G2_tension',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie angespannt bist du heute?',
    type: 'slider',
    metricKey: 'tension',
    showIf: (a) => isSel(a, 'G1', 'tension'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'ruhig', midLabel: 'merklich', maxLabel: 'maximal angespannt' },
  },
  {
    id: 'G2_stress',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie gestresst bist du heute?',
    type: 'slider',
    metricKey: 'stress',
    showIf: (a) => isSel(a, 'G1', 'stress'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'entspannt', midLabel: 'merklich', maxLabel: 'sehr gestresst' },
  },
  {
    id: 'G2_social',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie verbunden fühlst du dich heute mit anderen Menschen?',
    type: 'slider',
    metricKey: 'social_connection',
    showIf: (a) => isSel(a, 'G1', 'social'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'sehr isoliert', midLabel: 'gemischt', maxLabel: 'gut verbunden' },
  },
  {
    id: 'G2_movement',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie viel hast du dich letzte Woche bewegt?',
    type: 'slider',
    metricKey: 'movement',
    showIf: (a) => isSel(a, 'G1', 'movement'),
    slider: { min: 1, max: 10, defaultValue: 5, minLabel: 'kaum', midLabel: 'einige Male', maxLabel: 'sehr viel' },
  },
  {
    id: 'G2_caffeine',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Wie viele koffeinhaltige Getränke trinkst du typischerweise pro Tag?',
    type: 'slider',
    metricKey: 'caffeine',
    showIf: (a) => isSel(a, 'G1', 'caffeine'),
    slider: { min: 0, max: 8, step: 1, defaultValue: 2, minLabel: '0', midLabel: '4', maxLabel: '8+' },
  },
  {
    id: 'G2_alcohol',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'An wie vielen Tagen der letzten Woche hattest du Alkohol?',
    type: 'slider',
    metricKey: 'alcohol_days',
    showIf: (a) => isSel(a, 'G1', 'alcohol'),
    slider: { min: 0, max: 7, step: 1, defaultValue: 0, minLabel: '0', midLabel: '3–4', maxLabel: '7' },
  },
  {
    id: 'G3',
    module: 'G',
    screenLabel: 'S15',
    prompt: 'Ist heute ein eher typischer Tag für dich?',
    hint: 'Damit wird deine erste Einschätzung fair eingeordnet.',
    type: 'single',
    options: [
      { key: 'typical', label: 'Ja, ziemlich typisch' },
      { key: 'atypical', label: 'Nein, heute ist besonders' },
      { key: 'unsure', label: 'Weiß nicht' },
    ],
  },

  // ─── Modul F — Symptom-Check (freiwillig, FACHREVIEW OFFEN) ────────────────
  {
    id: 'F0',
    module: 'F',
    screenLabel: 'S15a',
    prompt: 'Symptom-Check — deine Selbstauskunft',
    hint: 'Diese Fragen stammen aus klassischen Anamnese-Bögen. Sie helfen dir und deiner Therapeut:in, den Blick zu schärfen — sie sind keine Diagnose und werden von Mynds nicht ausgewertet. Jede Frage kannst du einzeln auslassen.',
    why: 'Wir zeigen dir hier keine Punkte, Ampeln oder Bewertungen — nur deine eigenen Angaben.',
    type: 'info',
    sensitivity: 'very-high',
  },
  ...(
    [
      ['F1', 'Schläfst du schlecht ein oder durch?', 'high'],
      ['F2', 'Bist du oft müde oder hast wenig Energie?', 'high'],
      ['F3', 'Hat sich dein Appetit verändert?', 'high'],
      ['F4', 'Hast du weniger Freude oder Interesse an Dingen, die dir sonst wichtig sind?', 'high'],
      ['F5', 'Fühlst du dich häufig niedergeschlagen, schwermütig oder hoffnungslos?', 'very-high'],
      ['F6', 'Zweifelst du viel an dir oder hast Angst zu versagen?', 'high'],
      ['F7', 'Fällt es dir gerade schwer, dich zu konzentrieren?', 'high'],
      ['F8', 'Bist du unruhig, angespannt oder nervöser als früher?', 'high'],
      ['F9', 'Hast du Ängste oder Angstattacken?', 'very-high'],
    ] as const
  ).map(([id, prompt, sens]) => ({
    id,
    module: 'F' as ModuleKey,
    screenLabel: 'S15a',
    prompt,
    type: 'yesnoskip' as const,
    sensitivity: sens,
  })),
  {
    id: 'F10',
    module: 'F',
    screenLabel: 'S15a',
    prompt:
      'Gab es in letzter Zeit Momente, in denen du dachtest, es wäre besser, du wärst nicht mehr da — oder Gedanken, dir selbst zu schaden?',
    hint: 'Diese Frage stellen Anamnese-Bögen fast immer. Deine Antwort bleibt nur bei dir.',
    type: 'yesnoskip',
    sensitivity: 'maximum',
    crisisOnYes: true,
  },
  ...(
    [
      ['F11', 'Gab es früher schon Phasen, in denen es dir ähnlich schlecht ging?', 'very-high'],
      ['F12', 'Gab es schon mal Phasen, in denen du über längere Zeit viel zu tun warst, gedankenrasch und mit kaum Schlafbedürfnis?', 'very-high'],
      ['F13', 'Gibt es Dinge, von denen du dir vorgenommen hast, weniger zu konsumieren — oder haben andere dich darum gebeten?', 'very-high'],
      ['F14', 'Fällt es dir schwer, deine Essmengen zu steuern?', 'very-high'],
      ['F15', 'Nutzt du Wege wie Erbrechen, Abführmittel, langes Fasten oder sehr viel Sport, um dein Gewicht zu beeinflussen?', 'very-high'],
      ['F16', 'Nimmst du Dinge wahr, die andere nicht wahrnehmen (z. B. Stimmen oder Erscheinungen)?', 'maximum'],
    ] as const
  ).map(([id, prompt, sens]) => ({
    id,
    module: 'F' as ModuleKey,
    screenLabel: 'S15a',
    prompt,
    type: 'yesnoskip' as const,
    sensitivity: sens,
  })),
  {
    id: 'F17',
    module: 'F',
    screenLabel: 'S15a',
    prompt: 'Belastet dich körperlich gerade etwas?',
    type: 'multi',
    options: [
      { key: 'headache', label: 'Kopfschmerzen' },
      { key: 'back', label: 'Rückenschmerzen' },
      { key: 'dizzy', label: 'Schwindel' },
      { key: 'heart', label: 'Herzklopfen' },
      { key: 'breath', label: 'Atemnot' },
      { key: 'stomach', label: 'Magenbeschwerden' },
      { key: 'nausea', label: 'Übelkeit' },
      { key: 'restlessness', label: 'Unruhe' },
      { key: 'sweat', label: 'Schwitzen' },
      { key: 'tinnitus', label: 'Ohrgeräusche' },
      { key: 'menstrual', label: 'Menstruationsbeschwerden' },
      { key: 'none', label: 'nichts davon' },
    ],
  },

  // ─── Modul E — Medizinischer Kontext (freiwillig) ─────────────────────────
  {
    id: 'E0',
    module: 'E',
    screenLabel: 'S16',
    prompt: 'Medizinischer Kontext — komplett freiwillig',
    hint: 'Diese Angaben können deiner Therapeut:in helfen, den Überblick zu behalten. Mynds wertet nichts aus und ersetzt keine Ärzt:in.',
    type: 'info',
    sensitivity: 'very-high',
  },
  {
    id: 'E1',
    module: 'E',
    screenLabel: 'S16',
    prompt: 'Hattest du schon einmal Psychotherapie oder psychologische Beratung?',
    type: 'yesno',
    sensitivity: 'very-high',
  },
  {
    id: 'E2',
    module: 'E',
    screenLabel: 'S16',
    prompt: 'Bist du gerade in ärztlicher oder therapeutischer Behandlung?',
    hint: '"Bei wem" fragen wir bewusst nicht — das ist Sache deines Erstgesprächs.',
    type: 'yesno',
    sensitivity: 'very-high',
  },
  {
    id: 'E3',
    module: 'E',
    screenLabel: 'S16',
    prompt: 'Nimmst du aktuell Medikamente ein?',
    hint: 'Namen genügen — Dosierungen brauchst du hier nicht anzugeben.',
    type: 'yesno',
    sensitivity: 'very-high',
    followUpText: 'Welche? (Freitext, optional)',
  },
  {
    id: 'E4',
    module: 'E',
    screenLabel: 'S16',
    prompt: 'Gibt es körperliche Erkrankungen oder Einschränkungen, die relevant sein könnten?',
    type: 'yesno',
    sensitivity: 'high',
    followUpText: 'Möchtest du kurz beschreiben? (optional)',
  },
  {
    id: 'E5',
    module: 'E',
    screenLabel: 'S16',
    prompt: 'Was davon trifft zu?',
    hint: 'Erstüberblick ohne Mengen — vertiefen kannst du später im Tracking.',
    type: 'multi',
    options: [
      { key: 'coffee', label: 'Kaffee/Tee täglich' },
      { key: 'nicotine', label: 'Nikotin' },
      { key: 'alcohol_occ', label: 'Alkohol gelegentlich' },
      { key: 'alcohol_reg', label: 'Alkohol regelmäßig' },
      { key: 'other', label: 'weitere Substanzen' },
      { key: 'none', label: 'nichts davon' },
    ],
  },

  // ─── Modul H — Abschluss ───────────────────────────────────────────────────
  {
    id: 'H2',
    module: 'H',
    screenLabel: 'S17',
    prompt: 'Möchtest du etwas für dein erstes Therapiegespräch aufbewahren?',
    hint: 'Deine Ziele, Wünsche und — falls angelegt — deine Notizen landen dann im Vorbereitungs-Ordner. Sichtbar nur für dich.',
    type: 'ack',
    ackLabel: 'Ja, Ordner anlegen',
  },
];

/** Sichtbare Schritte unter Berücksichtigung der Verzweigungslogik. */
export function visibleSteps(answers: import('./types').Answers): QuestionDef[] {
  return catalog.filter((q) => !q.showIf || q.showIf(answers));
}

/** Aktive Schritte: sichtbar UND nicht als ganzes Modul übersprungen (E/F). */
export function activeSteps(
  answers: import('./types').Answers,
  skippedModules: string[],
): QuestionDef[] {
  return visibleSteps(answers).filter((q) => !skippedModules.includes(q.module));
}

/**
 * Anzeigbare Optionen einer Frage — inkl. dynamisch abgeleiteter Ranking-Optionen
 * (D2 aus der D1-Auswahl, einschließlich eigener Ziele mit custom:-Präfix).
 */
export function answerOptionsFor(question: QuestionDef, answers: import('./types').Answers): Option[] {
  if (question.optionsFromAnswer) {
    const src = answers[question.optionsFromAnswer]?.value;
    if (Array.isArray(src)) {
      const srcDef = catalog.find((q) => q.id === question.optionsFromAnswer);
      return src.map((key) => ({
        key,
        label: srcDef?.options?.find((o) => o.key === key)?.label ?? key.replace(/^custom:/, ''),
      }));
    }
    return [];
  }
  return question.options ?? [];
}

/** Lesbare Bezeichnung für einen gespeicherten Antwort-Schlüssel. */
export function labelForKey(
  question: QuestionDef,
  answers: import('./types').Answers,
  key: string,
): string {
  const opt = answerOptionsFor(question, answers).find((o) => o.key === key);
  return opt?.label ?? key.replace(/^custom:/, '');
}
