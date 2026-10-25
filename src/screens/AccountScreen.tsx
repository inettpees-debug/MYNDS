// A2 — Konto. PROTOTYP: simulierte Anmeldung (kein echter OAuth-Call).
// Ehrlich gekennzeichnet gemäß Regel „keine Scheinimplementierung ohne Label".
// Produktionspfad: Sign in with Apple + Google (Supabase Auth, R1-Integration).

import React from 'react';
import { View } from 'react-native';
import { Body, Button, Caption, Card, Screen, Title } from '../components/ui';
import { colors } from '../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

export function AccountScreen({ navigation }: Props) {
  return (
    <Screen>
      <Title>Dein Konto</Title>
      <Body muted style={{ marginTop: 8 }}>
        Ein Konto schützt deine Angaben — auch wenn du das Gerät wechselst. Wir speichern keine E-Mail-Adresse,
        wenn du das nicht willst.
      </Body>

      <View style={{ gap: 12, marginTop: 24 }}>
        <Button label="  Mit Apple fortfahren" onPress={() => navigation.navigate('Consent')} />
        <Button label="  Mit Google fortfahren" variant="secondary" onPress={() => navigation.navigate('Consent')} />
      </View>

      <Card style={{ marginTop: 24 }}>
        <Caption color={colors.ai}>⚙ Prototyp-Hinweis</Caption>
        <Body muted style={{ marginTop: 6 }}>
          In diesem Prototyp wird ein lokales Testkonto simuliert — es findet keine echte Anmeldung statt. Die
          echte Apple-/Google-Anmeldung kommt mit der Backend-Integration (Release 1).
        </Body>
      </Card>
    </Screen>
  );
}
