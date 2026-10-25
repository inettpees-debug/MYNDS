// H1 — Zusammenfassung & Korrektur vor dem Abschluss (Master-Prompt Modul I).
// Symptom-Check erscheinen hier ausschließlich als gegliederte Selbstauskunft
// ohne jede Auswertung (planung-app-v1.md, Addendum E2).

import React from 'react';
import { Pressable, View } from 'react-native';
import { Body, Button, Caption, Card, Screen, Title } from '../components/ui';
import { StorageBanner } from '../components/StorageBanner';
import { catalog, labelForKey, moduleMeta } from '../onboarding/catalog';
import { useOnboarding } from '../onboarding/state';
import { Answers, AnswerRecord, ModuleKey, QuestionDef } from '../onboarding/types';
import { colors, spacing } from '../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Summary'>;

function formatAnswer(q: QuestionDef, rec: AnswerRecord | undefined, answers: Answers): string {
  if (!rec) return 'offen';
  if (rec.deferred) return '⏳ später beantworten';
  if (rec.skipped) return '— lieber nicht beantwortet';
  const v = rec.value;
  if (q.type === 'yesnoskip' && v === undefined) return '— lieber nicht beantwortet';
  if (typeof v === 'boolean') return v ? 'Ja' : 'Nein';
  if (typeof v === 'number') {
    if (q.slider) return `${v} (${q.slider.minLabel} … ${q.slider.maxLabel})`;
    return String(v);
  }
  if (Array.isArray(v)) {
    return v.map((key) => labelForKey(q, answers, key)).join(' · ');
  }
  if (typeof v === 'string') {
    const base = labelForKey(q, answers, v);
    return rec.note ? `${base} — ${rec.note}` : base;
  }
  return 'offen';
}

export function SummaryScreen({ navigation }: Props) {
  const { state, complete } = useOnboarding();

  const modules = orderModules(state.answers);

  const finish = () => {
    complete();
    navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
  };

  return (
    <Screen>
      <StorageBanner />
      <Title>Fast geschafft — dein Überblick</Title>
      <Body muted style={{ marginTop: spacing.s }}>
        Tippe auf eine Angabe, um sie zu korrigieren. Nichts davon ist eine Diagnose — es sind deine Worte.
      </Body>

      <View style={{ gap: spacing.l, marginTop: spacing.xl }}>
        {modules.map(([mod, questions]) => {
          const meta = moduleMeta[mod];
          const skipped = state.skippedModules.includes(mod);
          return (
            <Card key={mod}>
              <Caption color={colors.accent} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
                {meta.title}
                {meta.optional ? ' (freiwillig)' : ''}
              </Caption>
              {skipped ? (
                <Body muted style={{ marginTop: spacing.s, fontSize: 14 }}>
                  Block übersprungen — du kannst ihn jederzeit in der App nachholen.
                </Body>
              ) : (
                <View style={{ marginTop: spacing.s, gap: spacing.m }}>
                  {questions
                    .filter((q) => q.type !== 'info')
                    .map((q) => {
                      const rec = state.answers[q.id];
                      return (
                        <Pressable
                          key={q.id}
                          accessibilityRole="button"
                          accessibilityLabel={`${q.prompt} bearbeiten`}
                          onPress={() => navigation.push('Question', { questionId: q.id })}
                        >
                          <Caption>{shortPrompt(q.prompt)}</Caption>
                          <Body style={{ fontSize: 15, marginTop: 2 }}>
                            {formatAnswer(q, rec, state.answers)}
                          </Body>
                        </Pressable>
                      );
                    })}
                </View>
              )}
            </Card>
          );
        })}
      </View>

      <View style={{ marginTop: spacing.xxl }}>
        <Button label="Abschließen und zur Startseite" onPress={finish} />
      </View>
    </Screen>
  );
}

function shortPrompt(prompt: string): string {
  return prompt.length > 48 ? `${prompt.slice(0, 46)}…` : prompt;
}

/** Aktive Module in Flow-Reihenfolge (B→C→D→G→F→E→H), nur mit inhaltlichen Fragen. */
function orderModules(answers: Answers): [ModuleKey, QuestionDef[]][] {
  const order: ModuleKey[] = ['B', 'C', 'D', 'G', 'F', 'E', 'H'];
  return order
    .map((mod) => [mod, catalog.filter((q) => q.module === mod)] as [ModuleKey, QuestionDef[]])
    .filter(([, qs]) => qs.length > 0)
    .map(([mod, qs]) => [
      mod,
      qs.filter((q) => !q.showIf || q.showIf(answers)),
    ]);
}
