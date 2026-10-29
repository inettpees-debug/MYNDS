import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  AlbertSans_400Regular,
  AlbertSans_500Medium,
  AlbertSans_600SemiBold,
} from '@expo-google-fonts/albert-sans';
import * as SplashScreen from 'expo-splash-screen';
import { OnboardingProvider } from './src/onboarding/state';
import { RootNavigator } from './src/navigation/RootNavigator';

// Splash bleibt sichtbar, bis die Markenschriften geladen sind (kein Flackern).
SplashScreen.preventAutoHideAsync().catch(() => {
  // Absichtlich still: Im Test-/Headless-Kontext ist der Splash nicht vorhanden.
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    AlbertSans_400Regular,
    AlbertSans_500Medium,
    AlbertSans_600SemiBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Splash bleibt stehen
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <OnboardingProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </OnboardingProvider>
      </View>
    </SafeAreaProvider>
  );
}
