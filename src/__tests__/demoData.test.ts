// Demo-Daten-Tests: Struktur, Guardrails, keine echten Daten.

import { buildDemoState } from '../onboarding/demoData';
import { activeSteps, catalog } from '../onboarding/catalog';

describe('Demo-Profil (Pitch-Daten)', () => {
  const demo = buildDemoState();

  test('ist als Demo markiert und abgeschlossen', () => {
    expect(demo.isDemo).toBe(true);
    expect(demo.completedAt).toBeTruthy();
  });

  test('F10 ist Nein — Krisenkarte erscheint nicht ungefragt im Standard-Demo', () => {
    expect(demo.answers.F10?.value).toBe(false);
  });

  test('alle Pflichtfragen sind beantwortet — Flow gilt als durchlaufen', () => {
    const required = catalog.filter((q) => q.required);
    for (const q of required) {
      expect(demo.answers[q.id]).toBeDefined();
    }
  });

  test('sichtbare G2-Baseline-Werte existieren für gewählte Variablen', () => {
    const vars = demo.answers.G1?.value as string[];
    const visible = activeSteps(demo.answers, []).map((q) => q.id);
    for (const id of visible.filter((id) => id.startsWith('G2_'))) {
      expect(typeof demo.answers[id]?.value).toBe('number');
    }
    expect(vars.length).toBeGreaterThan(0);
  });

  test('Demo-Zustand ist über den normalen Provider lauffähig (keine Fremd-Schlüssel)', () => {
    const validIds = new Set(catalog.map((q) => q.id).concat(['A5']));
    for (const key of Object.keys(demo.answers)) {
      expect(validIds.has(key)).toBe(true);
    }
  });
});
