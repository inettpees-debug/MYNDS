// A1 — Willkommen: Nutzenversprechen in 3 Karten + ehrliche Abgrenzung.
// Resume bei Zwischenstand; Demo-Einstieg mit synthetischem Profil (Pitch).

import React from 'react';
import { View } from 'react-native';
import { Button, Body, Caption, Card, Display, Screen, Title } from '../components/ui';
import { activeSteps } from '../onboarding/catalog';
import { buildDemoState } from '../onboarding/demoData';
import { useOnboarding } from '../onboarding/state';
import { colors } from '../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export function Wordmark({ small }: { small?: boolean }) {
  return (
    <Caption
      color={colors.accent}
      style={small ? { letterSpacing: 2, textTransform: 'uppercase' } : { letterSpacing: 3, fontSize: 14, textTransform: 'uppercase' }}
    >
      M Y N D S
    </Caption>
  );
}

export function WelcomeScreen({ navigation }: Props) {
  const { state, loadDemo } = useOnboarding();

  const hasProgress = Object.keys(state.answers).length > 0 && !state.completedAt;

  // Nächste offene Frage oder null (= alles beantwortet → Zusammenfassung).
  const resumeTargetId = (): string | null => {
    const steps = activeSteps(state.answers, state.skippedModules);
    const next = steps.find((q) => {
      if (q.type === 'info') return false; // Intros sind beim Resume übersprungen
      return !state.answers[q.id];
    });
    return next?.id ?? null;
  };

  return (
    <Screen>
      <Wordmark />
      <Display style={{ marginTop: 12 }}>Die Wartezeit muss kein Stillstand sein.</Display>
      <Body muted style={{ marginTop: 12 }}>
        Mynds begleitet dich zwischen „Ich brauche Hilfe" und „Meine Therapie beginnt".
      </Body>

      <View style={{ gap: 12, marginTop: 24 }}>
        <Card>
          <Title>Sammle deine Gedanken</Title>
          <Body muted style={{ marginTop: 6 }}>
            Festhalten, was dich beschäftigt — für dich und, wenn du möchtest, für dein Erstgespräch.
          </Body>
        </Card>
        <Card>
          <Title>Erkenne deine Muster</Title>
          <Body muted style={{ marginTop: 6 }}>
            Welche Zusammenhänge zeigen sich über Wochen? Mit deinen Daten, ehrlich eingeordnet.
          </Body>
        </Card>
        <Card>
          <Title>Begleitet, nicht behandelt</Title>
          <Body muted style={{ marginTop: 6 }}>
            Mynds ist keine Therapie, stellt keine Diagnosen und ist kein Ersatz für Fachpersonen. In akuten
            Krisen helfen sofort die Nummern im Sicherheitsbereich.
          </Body>
        </Card>
      </View>

      <View style={{ marginTop: 32, gap: 8 }}>
        {hasProgress ? (
          <Button
            label="Fortsetzen"
            onPress={() => {
              const target = resumeTargetId();
              if (target) navigation.navigate('Question', { questionId: target });
              else navigation.navigate('Summary');
            }}
          />
        ) : null}
        <Button
          label="Jetzt starten"
          variant={hasProgress ? 'secondary' : 'primary'}
          onPress={() => navigation.navigate('Account')}
        />
        {!hasProgress ? (
          <Button
            label="Demo-Profil laden (Beispieldaten)"
            variant="ghost"
            onPress={() => {
              loadDemo(buildDemoState());
              navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
            }}
          />
        ) : null}
        <Caption style={{ textAlign: 'center', marginTop: 8 }}>
          ~8–12 Minuten · alles Sensible ist freiwillig · jederzeit unterbrechbar
        </Caption>
      </View>
    </Screen>
  );
}
