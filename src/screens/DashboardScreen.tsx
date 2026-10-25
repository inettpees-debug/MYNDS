// Dashboard — ehrliches Profil aus echten (oder Demo-)Daten.
// Zeigt ausschließlich vorhandene Daten; keine Scores, keine Bewertung.
// Künftiges (R2/R3) ist kompakt und als geplant gekennzeichnet.

import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Body, Button, Caption, Card, CrisisCard, Screen, Title } from '../components/ui';
import { StorageBanner } from '../components/StorageBanner';
import { Wordmark } from './WelcomeScreen';
import { catalog, labelForKey } from '../onboarding/catalog';
import { useOnboarding } from '../onboarding/state';
import { colors, spacing } from '../theme/tokens';
import { QuestionDef } from '../onboarding/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const STATUS: Record<string, string> = {
  waiting: 'Du wartest auf einen Therapieplatz',
  appointment: 'Du hast einen Termin',
  in_therapy: 'Du bist in Therapie',
  self_care: 'Du begleitest deine Psyche',
};

/** Horizontale Anzeige eines Slider-Werts (1–10) — Darstellung, keine Bewertung. */
function ValueBar({ label, value, minLabel, maxLabel }: { label: string; value: number; minLabel: string; maxLabel: string }) {
  return (
    <View style={{ marginTop: spacing.m }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Body style={{ fontSize: 15 }}>{label}</Body>
        <Body style={{ fontSize: 15, color: colors.accent, fontWeight: '600' }}>{value}/10</Body>
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.track, marginTop: 6, overflow: 'hidden' }}>
        <View style={{ height: 6, width: `${value * 10}%`, borderRadius: 3, backgroundColor: colors.accentDeep }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Caption>{minLabel}</Caption>
        <Caption>{maxLabel}</Caption>
      </View>
    </View>
  );
}

export function DashboardScreen({ navigation }: Props) {
  const { state, reset } = useOnboarding();
  const [showExport, setShowExport] = useState(false);

  const a = state.answers;
  const name = (a.B3?.value as string | undefined)?.trim();
  const status = STATUS[String(a.B1?.value ?? '')] ?? 'Dein Raum';
  const termin = (a.B2?.value as string | undefined)?.trim();
  const anliegen = (a.C1?.value as string | undefined)?.trim();
  const burden = typeof a.C4?.value === 'number' ? a.C4.value : null;
  const goals = (a.D1?.value as string[] | undefined) ?? [];
  const goalLabels = goals.map((g) => labelForKey(catalog.find((q) => q.id === 'D1') as QuestionDef, state.answers, g));
  const topGoal = a.D2?.value ? labelForKey(catalog.find((q) => q.id === 'D2') as QuestionDef, state.answers, String(a.D2.value)) : null;
  const noGo = (a.D5?.value as string | undefined)?.trim();
  const vars = (a.G1?.value as string[] | undefined) ?? [];

  const varMeta: Record<string, { label: string; id: string; min: string; max: string }> = {
    mood: { label: 'Stimmung', id: 'G2_mood', min: 'sehr schlecht', max: 'sehr gut' },
    energy: { label: 'Energie', id: 'G2_energy', min: 'keine Energie', max: 'volle Energie' },
    sleep: { label: 'Schlaf', id: 'G2_sleep', min: 'sehr schlecht', max: 'sehr gut' },
    tension: { label: 'Anspannung', id: 'G2_tension', min: 'ruhig', max: 'maximal' },
    stress: { label: 'Stress', id: 'G2_stress', min: 'entspannt', max: 'sehr gestresst' },
    social: { label: 'Verbundenheit', id: 'G2_social', min: 'isoliert', max: 'verbunden' },
    movement: { label: 'Bewegung', id: 'G2_movement', min: 'kaum', max: 'sehr viel' },
    caffeine: { label: 'Koffein/Tag', id: 'G2_caffeine', min: '0', max: '8+' },
    alcohol: { label: 'Alkohol/Woche', id: 'G2_alcohol', min: '0', max: '7' },
  };

  // Symptom-Check: rein beschreibende Zählung, keine Auswertung
  const fIds = catalog.filter((q) => q.module === 'F' && q.type === 'yesnoskip').map((q) => q.id);
  const fYes = fIds.filter((id) => a[id]?.value === true).length;
  const fSkipped = fIds.filter((id) => a[id]?.skipped).length;

  const confirmDelete = () => {
    Alert.alert(
      'Wirklich alles löschen?',
      'Deine gesamten Angaben werden unwiderruflich von diesem Gerät gelöscht.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Alles löschen',
          style: 'destructive',
          onPress: () => {
            reset();
            navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <StorageBanner />
      <Wordmark small />
      <Title style={{ marginTop: spacing.s }}>
        {name ? `Schön, dass du da bist, ${name}.` : 'Schön, dass du da bist.'}
      </Title>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s, marginTop: spacing.xs }}>
        <Caption>{status}</Caption>
        {termin ? <Caption color={colors.textSecondary}>· {termin}</Caption> : null}
      </View>
      {state.isDemo ? (
        <View style={{ alignSelf: 'flex-start', marginTop: spacing.s, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Caption>⚙ Demo-Profil — synthetische Beispieldaten</Caption>
        </View>
      ) : null}

      {anliegen ? (
        <Card style={{ marginTop: spacing.l }}>
          <Caption>Dein Anliegen — in deinen Worten</Caption>
          <Body muted style={{ marginTop: spacing.s, fontSize: 15, lineHeight: 22 }}>
            {anliegen.length > 240 ? `${anliegen.slice(0, 240)} …` : anliegen}
          </Body>
          {burden !== null ? (
            <ValueBar label="Aktuelle Belastung" value={burden} minLabel="leicht störend" maxLabel="unerträglich" />
          ) : null}
        </Card>
      ) : null}

      {goalLabels.length > 0 ? (
        <Card style={{ marginTop: spacing.l }}>
          <Caption>Deine Ziele</Caption>
          <View style={{ marginTop: spacing.s, gap: spacing.xs }}>
            {goalLabels.map((g, i) => (
              <Body key={g + i} style={{ fontSize: 15 }}>
                {g === topGoal ? '★ ' : '· '}
                {g}
              </Body>
            ))}
          </View>
          {noGo ? (
            <Body muted style={{ marginTop: spacing.m, fontSize: 14, lineHeight: 20 }}>
              „{noGo}" — für dein erstes Gespräch aufbewahrt.
            </Body>
          ) : null}
        </Card>
      ) : null}

      {vars.length > 0 ? (
        <Card style={{ marginTop: spacing.l }}>
          <Caption>Dein Startbild — heute</Caption>
          <Body muted style={{ marginTop: spacing.s, fontSize: 14, lineHeight: 20 }}>
            {a.G3?.value === 'typical'
              ? 'Ein eher typischer Tag für dich — gute Basis für die ersten Wochen.'
              : 'Erster Eindruck, eingeordnet als nicht ganz typischer Tag.'}
          </Body>
          {vars
            .map((v) => varMeta[v])
            .filter(Boolean)
            .map((m) => {
              const val = a[m.id]?.value;
              return typeof val === 'number' ? (
                <ValueBar key={m.id} label={m.label} value={val} minLabel={m.min} maxLabel={m.max} />
              ) : null;
            })}
          <Caption style={{ marginTop: spacing.m }}>
            Werte sind deine eigenen Angaben — keine Auswertung, keine Diagnose.
          </Caption>
        </Card>
      ) : null}

      <Card style={{ marginTop: spacing.l }}>
        <Caption>Symptom-Check — deine Selbstauskunft</Caption>
        <Body muted style={{ marginTop: spacing.s, fontSize: 14, lineHeight: 20 }}>
          {fYes} von {fIds.length} Fragen mit „Ja" beantwortet{fSkipped > 0 ? ` · ${fSkipped} übergangen` : ''}. Mynds
          wertet nichts aus — deine Therapeut:in sieht die Angaben nur, wenn du sie selbst freigibst.
        </Body>
      </Card>

      <Card style={{ marginTop: spacing.l }}>
        <Caption>Was als Nächstes kommt</Caption>
        <Body muted style={{ marginTop: spacing.s, fontSize: 14, lineHeight: 20 }}>
          Sprachnotizen mit Transkription und der Bericht für deine Praxis (Release 2) · tägliche Check-ins
          und ehrliche Muster-Erkennung über Zeit (Release 3). Der Prototyp hält fest, was heute schon wichtig ist.
        </Body>
      </Card>

      <Card style={{ marginTop: spacing.l }}>
        <Caption>Sicherheitsbereich</Caption>
        <View style={{ marginTop: spacing.s }}>
          <CrisisCard heading="Hilfe ist jederzeit erreichbar" />
        </View>
      </Card>

      <Card style={{ marginTop: spacing.l }}>
        <Caption>Deine Daten — deine Kontrolle</Caption>
        <Body muted style={{ marginTop: spacing.s, fontSize: 14, lineHeight: 20 }}>
          „Alles löschen" entfernt alle Angaben von diesem Gerät. Die technische Datenansicht zeigt einen
          gekürzten Einblick — ein vollständiger Export folgt mit der nächsten Version.
        </Body>
        <View style={{ gap: spacing.s, marginTop: spacing.s }}>
          <Button label="Technische Datenansicht (gekürzt)" variant="secondary" onPress={() => setShowExport(!showExport)} />
          <Button label="Alles löschen" variant="ghost" onPress={confirmDelete} />
        </View>
        {showExport ? (
          <Caption style={{ marginTop: spacing.m }}>
            {JSON.stringify(state).slice(0, 900)}
            {JSON.stringify(state).length > 900 ? ' …' : ''}
          </Caption>
        ) : null}
      </Card>
    </Screen>
  );
}
