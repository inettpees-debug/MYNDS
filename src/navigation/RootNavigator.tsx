// Navigation: linearer Onboarding-Stack → Dashboard. Header bewusst ausgeblendet
// (eigene, ruhige Zurück-Navigation in der Engine).

import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/tokens';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { ConsentScreen } from '../screens/ConsentScreen';
import { SafetyScreen } from '../screens/SafetyScreen';
import { QuestionScreen } from '../screens/QuestionScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { DashboardScreen } from '../screens/DashboardScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Account: undefined;
  Consent: undefined;
  Safety: undefined;
  Question: { questionId: string };
  Summary: undefined;
  Dashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="Consent" component={ConsentScreen} />
        <Stack.Screen name="Safety" component={SafetyScreen} />
        <Stack.Screen name="Question" component={QuestionScreen} />
        <Stack.Screen name="Summary" component={SummaryScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
