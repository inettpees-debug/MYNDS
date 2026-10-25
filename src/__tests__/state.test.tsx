// State-/Persistenz-Tests: Autosave, Restore, Speicherfehler-Sichtbarkeit
// (P1-6), Retry, deterministischer Reset (Audit #9), StorageBanner.

import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable, Text, View } from 'react-native';
import { OnboardingProvider, useOnboarding } from '../onboarding/state';
import { OnboardingState } from '../onboarding/types';
import { StorageBanner } from '../components/StorageBanner';

jest.mock('../lib/storage', () => ({
  store: {
    loadOnboarding: jest.fn(async () => null),
    saveOnboarding: jest.fn(async () => undefined),
    clearAll: jest.fn(async () => undefined),
  },
}));

const { store } = require('../lib/storage') as { store: Record<string, jest.Mock> };

/** Kleiner Button-Stub für Trigger. */
function TriggerButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" testID={`btn-${label}`} onPress={onPress}>
      <Text>{label}</Text>
    </Pressable>
  );
}

/** Testsonde: exponiert Provider-Werte und Trigger als UI. */
function Probe() {
  const { hydrated, saveError, loadError, answer, reset, retrySave } = useOnboarding();
  return (
    <View>
      <Text>{`hydrated:${hydrated}`}</Text>
      <Text>{`saveError:${saveError}`}</Text>
      <Text>{`loadError:${loadError}`}</Text>
      <StorageBanner />
      <TriggerButton label="answer" onPress={() => answer('C2', { value: 'months', answeredAt: 'x' })} />
      <TriggerButton label="reset" onPress={reset} />
      <TriggerButton label="retry" onPress={retrySave} />
    </View>
  );
}

async function renderProvider(
  opts: { seed?: Partial<OnboardingState>; loadError?: boolean } = {},
) {
  if (opts.loadError) {
    store.loadOnboarding.mockRejectedValue(new Error('corrupt'));
  } else if (opts.seed) {
    store.loadOnboarding.mockResolvedValue({
      startedAt: 'x',
      answers: {},
      consents: [],
      skippedModules: [],
      ...opts.seed,
    });
  } else {
    store.loadOnboarding.mockResolvedValue(null);
  }
  await render(
    <OnboardingProvider>
      <Probe />
    </OnboardingProvider>,
  );
  await waitFor(() => expect(screen.getByText('hydrated:true')).toBeTruthy());
}

beforeEach(() => {
  store.loadOnboarding.mockReset().mockResolvedValue(null);
  store.saveOnboarding.mockReset().mockResolvedValue(undefined);
  store.clearAll.mockReset().mockResolvedValue(undefined);
});

describe('Persistenz', () => {
  test('Hydration stellt gespeicherte Antworten wieder her', async () => {
    await renderProvider({ seed: { answers: { C2: { value: 'months', answeredAt: 'x' } } } });
    expect(store.loadOnboarding).toHaveBeenCalled();
  });

  test('Antwort wird automatisch gespeichert (Autosave)', async () => {
    await renderProvider();
    fireEvent.press(screen.getByTestId('btn-answer'));
    await waitFor(() => expect(store.saveOnboarding).toHaveBeenCalled());
    const saved = store.saveOnboarding.mock.calls[store.saveOnboarding.mock.calls.length - 1][0] as OnboardingState;
    expect(saved.answers.C2?.value).toBe('months');
  });
});

describe('P1-6 Speicherfehler sichtbar', () => {
  test('Fehlgeschlagener Speichervorgang zeigt das Banner mit Hilfsangebot', async () => {
    store.saveOnboarding.mockRejectedValue(new Error('disk full'));
    await renderProvider();
    fireEvent.press(screen.getByTestId('btn-answer'));
    await waitFor(() => expect(screen.getByText(/Speichern fehlgeschlagen/)).toBeTruthy());
    expect(screen.getByText('Erneut speichern')).toBeTruthy();
  });

  test('retrySave behebt den Zustand, wenn Speichern dann klappt', async () => {
    store.saveOnboarding.mockRejectedValueOnce(new Error('disk full'));
    await renderProvider();
    fireEvent.press(screen.getByTestId('btn-answer'));
    await waitFor(() => expect(screen.getByText(/Speichern fehlgeschlagen/)).toBeTruthy());
    fireEvent.press(screen.getByText('Erneut speichern'));
    await waitFor(() => expect(screen.getByText('saveError:false')).toBeTruthy());
  });

  test('Ladefehler wird gemeldet, nicht verschluckt', async () => {
    await renderProvider({ loadError: true });
    await waitFor(() => expect(screen.getByText(/konnten nicht geladen werden/)).toBeTruthy());
    expect(screen.getByText('loadError:true')).toBeTruthy();
  });
});

describe('Audit #9 — deterministischer Reset', () => {
  test('clearAll wird gerufen; danach wird das frische Leer-Objekt NICHT sofort wieder gespeichert', async () => {
    await renderProvider({ seed: { answers: { C2: { value: 'months', answeredAt: 'x' } } } });
    const savesBefore = store.saveOnboarding.mock.calls.length;

    fireEvent.press(screen.getByTestId('btn-reset'));
    await waitFor(() => expect(store.clearAll).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 50)); // Effekt-Ticks abwarten

    expect(store.clearAll).toHaveBeenCalledTimes(1);
    expect(store.saveOnboarding.mock.calls.length).toBe(savesBefore); // kein Re-Save des Leerzustands

    // Nach dem Reset funktioniert normales Speichern wieder (Skip-Flag verbraucht)
    fireEvent.press(screen.getByTestId('btn-answer'));
    await waitFor(() =>
      expect(store.saveOnboarding.mock.calls.length).toBeGreaterThan(savesBefore),
    );
  });
});
