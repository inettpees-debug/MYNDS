// Lokale Persistenz — Abstraktion mit bewusstem Prototyp-Charakter.
// Prototyp: AsyncStorage (JSON). Produktionspfad R1: verschlüsseltes SQLite
// (SQLCipher) + Sync mit Supabase EU (planung-app-v1.md §4/§8).
// Interface bleibt identisch, damit der Austausch keinen Screen-Code berührt.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingState } from '../onboarding/types';

const KEY_ONBOARDING = 'mynds.onboarding.v1';

export interface LocalStore {
  loadOnboarding(): Promise<OnboardingState | null>;
  saveOnboarding(state: OnboardingState): Promise<void>;
  clearAll(): Promise<void>;
}

const storageImpl: LocalStore = {
  async loadOnboarding() {
    const raw = await AsyncStorage.getItem(KEY_ONBOARDING);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as OnboardingState;
    } catch {
      return null; // korrupter Zwischenstand → sauberer Neustart, kein Crash
    }
  },
  async saveOnboarding(state) {
    await AsyncStorage.setItem(KEY_ONBOARDING, JSON.stringify(state));
  },
  async clearAll() {
    await AsyncStorage.removeItem(KEY_ONBOARDING);
  },
};

export const store: LocalStore = storageImpl;
