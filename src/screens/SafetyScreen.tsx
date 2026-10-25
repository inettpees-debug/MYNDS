// A5 — Sicherheitsrahmen: feste Verankerung der Hilfe-Nummern (Richtlinien §2.2.3).
// Ruhige Gestaltung, kein Alarm-Rot, kein Blockieren.

import React from 'react';
import { View } from 'react-native';
import { Body, Button, Caption, Card, CrisisCard, Screen, Title } from '../components/ui';
import { catalog } from '../onboarding/catalog';
import { nowISO, useOnboarding } from '../onboarding/state';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Safety'>;

export function SafetyScreen({ navigation }: Props) {
  const { answer } = useOnboarding();
  const firstQuestionId = catalog[0].id;

  return (
    <Screen>
      <Title>Ein wichtiger Moment vorab</Title>
      <Body muted style={{ marginTop: 8 }}>
        Mynds ist nicht für akute Krisen. Wenn es dir gerade sehr schlecht geht, hole dir sofort Hilfe — diese
        Nummern sind kostenlos und rund um die Uhr erreichbar:
      </Body>

      <View style={{ marginTop: 16 }}>
        <CrisisCard heading="Hier bekommst du sofort Hilfe" />
      </View>

      <Card style={{ marginTop: 16 }}>
        <Body muted>
          Diese Nummern findest du später jederzeit im Sicherheitsbereich deiner Startseite. Dein
          Symptom-Check und alle anderen Angaben ersetzen keine fachliche Einschätzung.
        </Body>
      </Card>

      <View style={{ marginTop: 24 }}>
        <Button
          label="Verstanden — weiter geht's"
          onPress={() => {
            answer('A5', { value: true, answeredAt: nowISO() });
            navigation.navigate('Question', { questionId: firstQuestionId });
          }}
        />
        <Caption style={{ textAlign: 'center', marginTop: 8 }}>
          Mit „Verstanden" bestätigst du die Kenntnisnahme, keine Einwilligung.
        </Caption>
      </View>
    </Screen>
  );
}
