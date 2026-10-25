// Komponenten-Tests für die Frage-Engine:
// P0-2 Slider-Restore · P0-3 YesNoSkip-Skip-Flag · P0-4 D2-Ranking ·
// P1-5 eigene Ziele · F10-Krisenkarte (Guardrail-Verifikation).
// Storage wird gemockt: Seeding über loadOnboarding, Assertions über saveOnboarding.

import React from 'react';
import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import { OnboardingProvider } from '../onboarding/state';
import { OnboardingState } from '../onboarding/types';
import { QuestionScreen } from '../screens/QuestionScreen';

jest.mock('@react-native-community/slider', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { __esModule: true, default: () => <View /> };
});

jest.mock('../lib/storage', () => ({
  store: {
    loadOnboarding: jest.fn(async () => null),
    saveOnboarding: jest.fn(async () => undefined),
    clearAll: jest.fn(async () => undefined),
  },
}));

const { store } = require('../lib/storage') as { store: Record<string, jest.Mock> };

const makeNav = () => ({
  navigate: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
});

async function renderQuestion(questionId: string, seed?: Partial<OnboardingState>) {
  store.loadOnboarding.mockResolvedValue({
    startedAt: '2026-10-23T00:00:00Z',
    answers: {},
    consents: [],
    skippedModules: [],
    ...seed,
  });
  store.saveOnboarding.mockClear();
  const navigation = makeNav();
  await render(
    <OnboardingProvider>
      <QuestionScreen navigation={navigation as never} route={{ params: { questionId }} as never} />
    </OnboardingProvider>,
  );
  // Warten bis Hydration abgeschlossen und die Frage wirklich steht.
  await waitFor(() => expect(screen.getByRole('button', { name: 'Weiter' })).toBeTruthy());
  return navigation;
}

function lastSaved(): OnboardingState | undefined {
  const calls = store.saveOnboarding.mock.calls;
  return calls.length ? (calls[calls.length - 1][0] as OnboardingState) : undefined;
}

/** Antwort-Assertion, robust gegen den initialen Hydration-Save. */
async function expectSaved(getter: (s: OnboardingState) => unknown, expected: unknown) {
  await waitFor(() => expect(getter(lastSaved() as OnboardingState)).toBe(expected));
}

beforeEach(() => {
  store.loadOnboarding.mockReset().mockResolvedValue(null);
  store.saveOnboarding.mockReset().mockResolvedValue(undefined);
  store.clearAll.mockReset().mockResolvedValue(undefined);
});

// ─── P0-2: Slider-Restore ───────────────────────────────────────────────────

describe('P0-2 Slider-Restore', () => {
  test('Wiederöffnen zeigt gespeicherten Wert (8) statt Default (5) und überschreibt ihn nicht', async () => {
  const user = userEvent.setup();
    await renderQuestion('C4', {
      answers: { C4: { value: 8, answeredAt: '2026-10-23T10:00:00Z' } },
    });
    expect(screen.getByText('8')).toBeTruthy();

    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.C4?.value, 8); // Regression: war vorher 5
  });

  test('Neue Frage ohne Antwort erhält den dokumentierten Default', async () => {
  const user = userEvent.setup();
    await renderQuestion('G2_mood', {
      answers: { G1: { value: ['mood'], answeredAt: 'x' } },
    });
    expect(screen.getByText('5')).toBeTruthy();
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.G2_mood?.value, 5);
  });
});

// ─── P0-3: YesNoSkip-Skip-Flag ──────────────────────────────────────────────

describe('P0-3 YesNoSkip: „lieber nicht beantworten“', () => {
  test('Skip-Antwort wird eindeutig mit skipped:true gespeichert', async () => {
  const user = userEvent.setup();
    await renderQuestion('F1');
    await user.press(screen.getByRole('radio', { name: 'Lieber nicht beantworten' }));
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.F1?.skipped, true);
    expect(lastSaved()?.answers.F1?.value).toBeUndefined();
  });

  test('„Ja“ wird als true gespeichert (kein Skip)', async () => {
  const user = userEvent.setup();
    await renderQuestion('F1');
    await user.press(screen.getByRole('radio', { name: 'Ja' }));
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.F1?.value, true);
    expect(lastSaved()?.answers.F1?.skipped).toBeFalsy();
  });

  test('Gespeicherte Skip-Antwort überlebt das Wiederöffnen unverändert', async () => {
  const user = userEvent.setup();
    await renderQuestion('F1', {
      answers: { F1: { skipped: true, answeredAt: 'x' } },
    });
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.F1?.skipped, true); // Restore bleibt Skip
  });
});

// ─── P0-4: D2-Zielpriorisierung ─────────────────────────────────────────────

describe('P0-4 D2-Ranking aus D1-Auswahl', () => {
  const seed = {
    answers: {
      D1: { value: ['anxiety', 'custom:Mein eigenes Ziel'], answeredAt: 'x' },
    },
  };

  test('Optionen stammen aus D1 — inklusive eigenem Ziel', async () => {
  const user = userEvent.setup();
    await renderQuestion('D2', seed);
    expect(screen.getByRole('radio', { name: 'Ängste besser aushalten' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Mein eigenes Ziel' })).toBeTruthy();
  });

  test('Auswahl wird korrekt gespeichert und wiederhergestellt', async () => {
  const user = userEvent.setup();
    await renderQuestion('D2', seed);
    await user.press(screen.getByRole('radio', { name: 'Mein eigenes Ziel' }));
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.D2?.value, 'custom:Mein eigenes Ziel');

    // Wiederherstellung: gespeicherte D2-Antwort erneut öffnen, unverändert fortführen
    await renderQuestion('D2', {
      answers: {
        ...seed.answers,
        D2: { value: 'custom:Mein eigenes Ziel', answeredAt: 'x' },
      },
    });
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved((s) => s.answers.D2?.value, 'custom:Mein eigenes Ziel');
  });
});

// ─── P1-5: Eigene Ziele persistent ──────────────────────────────────────────

describe('P1-5 Eigene Ziele beim Wiederöffnen', () => {
  const seed = {
    answers: {
      D1: { value: ['custom:Mein Ziel', 'anxiety'], answeredAt: 'x' },
    },
  };

  test('Eigenes Ziel bleibt als Chip sichtbar und ausgewählt', async () => {
  const user = userEvent.setup();
    await renderQuestion('D1', seed);
    const chip = screen.getByRole('checkbox', { name: /Mein Ziel/ });
    expect(chip.props.accessibilityState?.selected).toBe(true);
  });

  test('Eigenes Ziel kann abgewählt werden — gespeicherte Auswahl aktualisiert sich', async () => {
  const user = userEvent.setup();
    await renderQuestion('D1', seed);
    await user.press(screen.getByRole('checkbox', { name: /Mein Ziel/ })); // abwählen
    await user.press(screen.getByRole('button', { name: 'Weiter' }));
    await expectSaved(
      (s) => JSON.stringify(s.answers.D1?.value),
      JSON.stringify(['anxiety']),
    );
  });
});

// ─── Guardrail: F10-Krisenkarte ─────────────────────────────────────────────

describe('F10 Krisenkarte (Guardrail)', () => {
  test('„Ja“ zeigt sofort die Hilfe-Nummern — ohne Auswertung, ohne Blockieren', async () => {
  const user = userEvent.setup();
    await renderQuestion('F10');
    expect(screen.queryByText('0800 111 0 111')).toBeNull();
    await user.press(screen.getByRole('radio', { name: 'Ja' }));
    expect(screen.getByText('0800 111 0 111')).toBeTruthy();
    expect(screen.getByText('116 117')).toBeTruthy();
    // Weiter bleibt möglich (nicht sperrend)
    expect(screen.getByRole('button', { name: 'Weiter' })).toBeTruthy();
  });

  test('„Nein“ zeigt keine Krisenkarte', async () => {
  const user = userEvent.setup();
    await renderQuestion('F10');
    await user.press(screen.getByRole('radio', { name: 'Nein' }));
    expect(screen.queryByText('0800 111 0 111')).toBeNull();
  });
});
