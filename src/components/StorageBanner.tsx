// Sichtbarer Hinweis bei Speicher-/Ladefehlern (Audit P1-6).
// Klar, ruhig, barrierearm — und behauptet nie, Daten seien gesichert, wenn sie
// es nicht sind.

import React from 'react';
import { View } from 'react-native';
import { Body, Button, Caption, Card } from './ui';
import { useOnboarding } from '../onboarding/state';
import { colors, spacing } from '../theme/tokens';

export function StorageBanner() {
  const { saveError, loadError, retrySave } = useOnboarding();
  if (!saveError && !loadError) return null;

  return (
    <Card style={{ borderLeftWidth: 3, borderLeftColor: colors.warning, marginBottom: spacing.l }}>
      {loadError ? (
        <Body style={{ fontWeight: '600', marginBottom: spacing.s }}>
          Gespeicherte Angaben konnten nicht geladen werden.
        </Body>
      ) : null}
      {saveError ? (
        <Body muted style={{ fontSize: 14, lineHeight: 20 }}>
          Speichern fehlgeschlagen — deine letzte Antwort ist nur bis zum Beenden der App gesichert. Deine
          Eingaben auf dem Bildschirm bleiben erhalten.
        </Body>
      ) : null}
      {loadError && !saveError ? (
        <Body muted style={{ fontSize: 14, lineHeight: 20 }}>
          Möglicherweise startest du mit einem frischen Profil. Bitte prüfe deine Angaben, bevor du
          weitermachst.
        </Body>
      ) : null}
      {saveError ? (
        <View style={{ marginTop: spacing.m, alignSelf: 'flex-start' }}>
          <Button label="Erneut speichern" variant="secondary" onPress={retrySave} />
        </View>
      ) : null}
      <Caption style={{ marginTop: spacing.s }}>
        Mynds speichert derzeit auf deinem Gerät — ohne Cloud.
      </Caption>
    </Card>
  );
}
