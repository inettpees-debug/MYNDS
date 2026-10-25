// Synthetische Demo-Daten für den Pitch: komplett fiktive Person "Mia",
// keine echten Gesundheitsdaten (Pitch-Sprint-Regel). F10 bewusst "Nein",
// damit die Krisenkarte im Demo-Standardablauf nicht ungewollt erscheint —
// sie wird separat im Sicherheitsbereich und im Demo-Skript gezeigt.

import { OnboardingState } from './types';

const t = (min: number) => new Date(Date.now() - min * 60_000).toISOString();

export function buildDemoState(): OnboardingState {
  return {
    startedAt: t(9),
    completedAt: t(1),
    isDemo: true,
    consents: [
      { scope: 'basis', granted: true, policyVersion: '2026-10-r1', changedAt: t(9) },
      { scope: 'cloud_stt', granted: false, policyVersion: '2026-10-r1', changedAt: t(9) },
      { scope: 'ai_support', granted: true, policyVersion: '2026-10-r1', changedAt: t(9) },
      { scope: 'analytics', granted: false, policyVersion: '2026-10-r1', changedAt: t(9) },
    ],
    skippedModules: [],
    answers: {
      A5: { value: true, answeredAt: t(8) },
      B1: { value: 'waiting', answeredAt: t(8) },
      B2: { value: 'Erstgespräch in ca. 5 Wochen', answeredAt: t(8) },
      B3: { value: 'Mia', answeredAt: t(8) },
      B4: { value: '1997', answeredAt: t(8) },
      B5: { value: 'de', answeredAt: t(8) },
      C1: {
        value:
          'Ich warte seit vier Monaten auf einen Therapieplatz. Nachts grüble ich viel, morgens fällt mir der Start schwer. Auf der Arbeit funktioniere ich irgendwie, aber richtig da bin ich selten. Ich möchte verstehen, was mich runterzieht — und vorbereitet sein, wenn die Therapie endlich anfängt.',
        answeredAt: t(8),
      },
      C2: { value: 'half_year', answeredAt: t(7) },
      C3: { value: 'daily', answeredAt: t(7) },
      C4: { value: 7, answeredAt: t(7) },
      C5: { value: ['sleep', 'work', 'self_worth'], answeredAt: t(7) },
      C6: {
        value: 'Besser: Spaziergänge mit meiner Schwester, Podcasts abends. Schlimmer: zu viel Kaffee, endloses Scrollen vor dem Schlafen.',
        answeredAt: t(7),
      },
      C7: { value: ['talks', 'movement', 'self_help'], answeredAt: t(6) },
      D1: { value: ['sleep_calm', 'boundaries'], answeredAt: t(6) },
      D2: { value: 'sleep_calm', answeredAt: t(6) },
      D3: { value: 'Warum kippt meine Stimmung abends so schnell?', answeredAt: t(6) },
      D4: { value: ['listening', 'patience'], answeredAt: t(6) },
      D5: { value: 'Nicht das Gefühl haben, alles selbst lösen zu müssen.', answeredAt: t(6) },
      D6: { value: ['persistent', 'empathic', 'curious'], answeredAt: t(5) },
      D7: { value: ['partner', 'friends'], answeredAt: t(5) },
      D8: { value: 'Bodensee-Wanderungen, Kochen mit Freund:innen, schlechte Krimis.', answeredAt: t(5) },
      G1: { value: ['mood', 'energy', 'sleep', 'tension'], answeredAt: t(5) },
      G2_mood: { value: 4, answeredAt: t(5) },
      G2_energy: { value: 4, answeredAt: t(5) },
      G2_sleep: { value: 3, answeredAt: t(5) },
      G2_tension: { value: 7, answeredAt: t(5) },
      G3: { value: 'typical', answeredAt: t(4) },
      F1: { value: true, answeredAt: t(4) },
      F2: { value: true, answeredAt: t(4) },
      F3: { value: false, answeredAt: t(4) },
      F4: { value: true, answeredAt: t(4) },
      F5: { value: true, answeredAt: t(4) },
      F6: { value: true, answeredAt: t(4) },
      F7: { value: false, answeredAt: t(4) },
      F8: { value: true, answeredAt: t(4) },
      F9: { value: false, answeredAt: t(4) },
      F10: { value: false, answeredAt: t(4) },
      F11: { value: true, answeredAt: t(4) },
      F12: { value: false, answeredAt: t(4) },
      F13: { value: false, answeredAt: t(4) },
      F14: { value: false, answeredAt: t(4) },
      F15: { value: false, answeredAt: t(4) },
      F16: { value: false, answeredAt: t(4) },
      F17: { value: ['headache', 'restlessness'], answeredAt: t(4) },
      E1: { value: false, answeredAt: t(3) },
      E2: { value: false, answeredAt: t(3) },
      E3: { value: false, answeredAt: t(3) },
      E4: { value: false, answeredAt: t(3) },
      E5: { value: ['coffee'], answeredAt: t(3) },
      H2: { value: true, answeredAt: t(2) },
    },
  };
}
