// Onboarding-Zustand: Context + Reducer, Autosave nach jeder Antwort,
// Resume nach Unterbrechung (Master-Prompt 1.1). Konsolidiert über alle
// Fragen hinweg — Grundlage für Zusammenfassung, Korrektur und späteren Export.

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { Answers, AnswerRecord, ConsentRecord, OnboardingState } from './types';
import { store } from '../lib/storage';

type Action =
  | { type: 'HYDRATE'; state: OnboardingState }
  | { type: 'ANSWER'; id: string; record: AnswerRecord }
  | { type: 'SET_CONSENTS'; consents: ConsentRecord[] }
  | { type: 'SKIP_MODULE'; module: string }
  | { type: 'COMPLETE' }
  | { type: 'LOAD_DEMO'; state: OnboardingState }
  | { type: 'RESET' };

function initialState(): OnboardingState {
  return {
    startedAt: new Date().toISOString(),
    answers: {},
    consents: [],
    skippedModules: [],
  };
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case 'HYDRATE':
      return action.state;
    case 'ANSWER':
      return { ...state, answers: { ...state.answers, [action.id]: action.record } };
    case 'SET_CONSENTS':
      return { ...state, consents: action.consents };
    case 'SKIP_MODULE':
      return state.skippedModules.includes(action.module)
        ? state
        : { ...state, skippedModules: [...state.skippedModules, action.module] };
    case 'COMPLETE':
      return { ...state, completedAt: new Date().toISOString() };
    case 'LOAD_DEMO':
      return action.state;
    case 'RESET':
      return initialState();
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  hydrated: boolean;
  /** true, wenn der letzte Speichervorgang fehlschlug (Daten nur bis App-Ende gesichert). */
  saveError: boolean;
  /** true, wenn gespeicherte Daten beim Start nicht geladen werden konnten. */
  loadError: boolean;
  answer: (id: string, record: AnswerRecord) => void;
  setConsents: (consents: ConsentRecord[]) => void;
  skipModule: (module: string) => void;
  complete: () => void;
  /** Pitch-Demo: lädt ein komplett synthetisches Profil (isDemo). */
  loadDemo: (demo: OnboardingState) => void;
  reset: () => void;
  /** Versucht, den letzten Zustand erneut zu speichern. */
  retrySave: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [hydrated, setHydrated] = React.useState(false);
  const [saveError, setSaveError] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  // Deterministischer Reset (Audit #9): nach clearAll darf der Save-Effekt das
  // frische Leer-Objekt nicht sofort wieder schreiben.
  const skipNextPersist = React.useRef(false);

  useEffect(() => {
    store
      .loadOnboarding()
      .then((loaded) => {
        if (loaded) dispatch({ type: 'HYDRATE', state: loaded });
      })
      .catch(() => setLoadError(true)) // Ladeversagen sichtbar machen, nie still
      .finally(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    let cancelled = false;
    store
      .saveOnboarding(state)
      .then(() => {
        if (!cancelled) setSaveError(false);
      })
      .catch(() => {
        if (!cancelled) setSaveError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [state, hydrated]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      state,
      hydrated,
      saveError,
      loadError,
      answer: (id, record) => dispatch({ type: 'ANSWER', id, record }),
      setConsents: (consents) => dispatch({ type: 'SET_CONSENTS', consents }),
      skipModule: (module) => dispatch({ type: 'SKIP_MODULE', module }),
      complete: () => dispatch({ type: 'COMPLETE' }),
      loadDemo: (demo) => dispatch({ type: 'LOAD_DEMO', state: demo }),
      reset: () => {
        skipNextPersist.current = true;
        dispatch({ type: 'RESET' });
        store.clearAll().catch(() => undefined);
      },
      retrySave: () => {
        store
          .saveOnboarding(state)
          .then(() => setSaveError(false))
          .catch(() => setSaveError(true));
      },
    }),
    [state, hydrated, saveError, loadError],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}

export function nowISO(): string {
  return new Date().toISOString();
}

/** Antwort-Wert einer Frage (wertfrei, wenn übersprungen/vertagt). */
export function answerValue(answers: Answers, id: string): AnswerRecord['value'] {
  return answers[id]?.value;
}
