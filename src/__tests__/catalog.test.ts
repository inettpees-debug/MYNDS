// Logik-Tests: Verzweigungslogik (activeSteps), abgeleitete Ranking-Optionen
// (answerOptionsFor/labelForKey). Reine Funktionen — ohne Rendering.

import { activeSteps, answerOptionsFor, catalog, labelForKey } from '../onboarding/catalog';
import { Answers } from '../onboarding/types';

const answersWith = (answers: Answers): Answers => answers;

describe('activeSteps — Verzweigungslogik', () => {
  test('G2-Slider erscheinen nur für gewählte Tracking-Variablen', () => {
    const a = answersWith({ G1: { value: ['mood'], answeredAt: '2026-10-23T00:00:00Z' } });
    const ids = activeSteps(a, []).map((q) => q.id);
    expect(ids).toContain('G2_mood');
    expect(ids).not.toContain('G2_energy');
    expect(ids).not.toContain('G2_sleep');
  });

  test('D2 erscheint erst ab zwei gewählten Zielen', () => {
    const one = answersWith({ D1: { value: ['anxiety'], answeredAt: 'x' } });
    const two = answersWith({ D1: { value: ['anxiety', 'energy'], answeredAt: 'x' } });
    expect(activeSteps(one, []).map((q) => q.id)).not.toContain('D2');
    expect(activeSteps(two, []).map((q) => q.id)).toContain('D2');
  });

  test('B2 (Terminfrage) nur mit relevantem B1-Kontext', () => {
    const waiting = answersWith({ B1: { value: 'waiting', answeredAt: 'x' } });
    const selfCare = answersWith({ B1: { value: 'self_care', answeredAt: 'x' } });
    expect(activeSteps(waiting, []).map((q) => q.id)).toContain('B2');
    expect(activeSteps(selfCare, []).map((q) => q.id)).not.toContain('B2');
  });

  test('Übersprungenes Modul F entfernt alle Screening-Fragen', () => {
    const ids = activeSteps({}, ['F']).map((q) => q.id);
    expect(ids).not.toContain('F1');
    expect(ids).not.toContain('F10');
    expect(ids).not.toContain('F17');
    expect(ids).toContain('E0'); // anderes freiwilliges Modul bleibt
  });
});

describe('answerOptionsFor — D2-Optionen aus D1 (P0-4)', () => {
  const d2 = catalog.find((q) => q.id === 'D2')!;
  const answers = answersWith({
    D1: { value: ['anxiety', 'custom:Mein eigenes Ziel'], answeredAt: 'x' },
  });

  test('enthält definierte und eigene Ziele mit lesbaren Labels', () => {
    const opts = answerOptionsFor(d2, answers);
    expect(opts).toEqual([
      { key: 'anxiety', label: 'Ängste besser aushalten' },
      { key: 'custom:Mein eigenes Ziel', label: 'Mein eigenes Ziel' },
    ]);
  });

  test('labelForKey löst definierte Schlüssel und Custom-Präfix', () => {
    expect(labelForKey(d2, answers, 'anxiety')).toBe('Ängste besser aushalten');
    expect(labelForKey(d2, answers, 'custom:Mein eigenes Ziel')).toBe('Mein eigenes Ziel');
  });

  test('ohne D1-Antwort: keine Optionen (leere Auswahl statt Absturz)', () => {
    expect(answerOptionsFor(d2, {})).toEqual([]);
  });
});
