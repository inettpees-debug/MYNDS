// Datengetriebene Onboarding-Engine: rendert jede Frage aus catalog.ts.
// Regeln (fragenkatalog-r1.md): Pflicht nur für Minimalangaben · alles Sensible
// überspringbar · Skalen mit Wortankern · F10-"Ja" zeigt sofort die ruhige
// Hilfekarte (niemals blockierend) · Autosave nach jeder Antwort.

import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import {
  Body,
  Button,
  Caption,
  Card,
  ChipGroup,
  CrisisCard,
  ModuleHeader,
  ProgressBar,
  Screen,
  SliderField,
  Textarea,
  Title,
  WhyHint,
} from '../components/ui';
import { StorageBanner } from '../components/StorageBanner';
import { activeSteps, answerOptionsFor, catalog, moduleMeta } from '../onboarding/catalog';
import { nowISO, useOnboarding } from '../onboarding/state';
import { AnswerRecord, AnswerValue, Option, QuestionDef } from '../onboarding/types';
import { colors, fonts, spacing } from '../theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Question'>;

export function QuestionScreen({ navigation, route }: Props) {
  const { state, answer, skipModule, hydrated } = useOnboarding();
  const { questionId } = route.params;

  const question = useMemo(
    () => catalog.find((q) => q.id === questionId),
    [questionId],
  );

  // Lokale Eingabezustände — werden bei Fragenwechsel neu initialisiert
  const [textValue, setTextValue] = useState('');
  const [singleKey, setSingleKey] = useState<string | null>(null);
  const [multiKeys, setMultiKeys] = useState<string[]>([]);
  const [customOptions, setCustomOptions] = useState<Option[]>([]);
  const [customDraft, setCustomDraft] = useState('');
  const [sliderValue, setSliderValue] = useState(5);
  const [yesNo, setYesNo] = useState<boolean | null>(null);
  const [yesNoSkip, setYesNoSkip] = useState<'yes' | 'no' | 'skip' | null>(null);
  const [followText, setFollowText] = useState('');
  const [year, setYear] = useState('');
  const [maxHint, setMaxHint] = useState(false);

  useEffect(() => {
    const rec = question ? state.answers[question.id] : undefined;
    setTextValue(typeof rec?.value === 'string' ? rec.value : '');
    setSingleKey(typeof rec?.value === 'string' ? rec.value : null);
    const prevMulti = Array.isArray(rec?.value) ? rec.value : [];
    setMultiKeys(prevMulti);
    // Eigene Optionen (custom:-Schlüssel) aus der gespeicherten Antwort
    // rekonstruieren, damit sie beim Wiederöffnen sichtbar und abwählbar sind.
    setCustomOptions(
      prevMulti
        .filter((k) => k.startsWith('custom:'))
        .map((k) => ({ key: k, label: k.slice('custom:'.length) })),
    );
    setCustomDraft('');
    // Gespeicherten Slider-Wert wiederherstellen; Default nur ohne Antwort (P0-2).
    setSliderValue(
      typeof rec?.value === 'number' ? rec.value : (question?.slider?.defaultValue ?? 5),
    );
    setYesNo(typeof rec?.value === 'boolean' ? rec.value : null);
    setYesNoSkip(rec?.skipped ? 'skip' : typeof rec?.value === 'boolean' ? (rec.value ? 'yes' : 'no') : null);
    setFollowText('');
    setYear(typeof rec?.value === 'string' ? rec.value : '');
    setMaxHint(false);
    // Auch bei abgeschlossener Hydration einmal anwenden: falls dieser Screen
    // vor Ende des Ladens geöffnet wurde, stünde sonst der Default statt der
    // gespeicherten Antwort (P0-2).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, hydrated]);

  if (!question) {
    return (
      <Screen>
        <Body muted>Frage nicht gefunden.</Body>
      </Screen>
    );
  }

  const steps = activeSteps(state.answers, state.skippedModules);
  const index = steps.findIndex((q) => q.id === question.id);

  // Early-Redirect erst nach Hydration: vorher sind die Antworten noch leer
  // und bedingte Fragen (D2, G2_*) wären fälschlich „unsichtbar“.
  if (hydrated && index === -1) {
    const next = nextActiveAfter(question, state.answers, state.skippedModules);
    if (next) {
      navigation.replace('Question', { questionId: next.id });
      return null;
    }
    navigation.replace('Summary');
    return null;
  }
  if (!hydrated) {
    // Ruhiger Ladezustand statt leerem Screen
    return (
      <Screen scroll={false}>
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xxxl, gap: spacing.m }}>
          <ActivityIndicator color={colors.accent} />
          <Caption>Deine Angaben werden geladen …</Caption>
        </View>
      </Screen>
    );
  }

  const meta = moduleMeta[question.module];

  // ── Antwort-Validierung ───────────────────────────────────────────────────
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  const ageOk = year.length === 4 && !Number.isNaN(yearNum) && currentYear - yearNum >= 18 && yearNum >= 1900;
  const isMinor = year.length === 4 && !Number.isNaN(yearNum) && currentYear - yearNum < 18 && yearNum >= 1900;

  const isValid = (): boolean => {
    switch (question.type) {
      case 'text':
      case 'textarea':
      case 'voice':
        return textValue.trim().length > 0;
      case 'single':
      case 'ranking':
        return singleKey !== null;
      case 'multi':
        return multiKeys.length >= (question.minSelection ?? 1);
      case 'yesno':
        return yesNo !== null;
      case 'yesnoskip':
        return yesNoSkip !== null;
      case 'year':
        return ageOk;
      default:
        return true; // slider (Default zählt als Angabe), info, ack
    }
  };

  const collectValue = (): AnswerValue => {
    switch (question.type) {
      case 'text':
      case 'textarea':
      case 'voice':
        return textValue.trim();
      case 'single':
      case 'ranking':
        return singleKey;
      case 'multi':
        return multiKeys;
      case 'slider':
        return sliderValue;
      case 'yesno':
        return yesNo ?? undefined;
      case 'yesnoskip':
        return yesNoSkip === 'yes' ? true : undefined;
      case 'year':
        return year;
      default:
        return true;
    }
  };

  const advance = (record: AnswerRecord) => {
    answer(question.id, record);
    const updatedAnswers = { ...state.answers, [question.id]: record };
    const updatedSkipped = state.skippedModules;
    const next = nextActiveAfter(question, updatedAnswers, updatedSkipped);
    if (next) navigation.push('Question', { questionId: next.id });
    else navigation.push('Summary');
  };

  const submit = () => {
    const note =
      question.type === 'yesno' && yesNo === true && question.followUpText && followText.trim()
        ? followText.trim()
        : undefined;
    // YesNoSkip (P0-3): „lieber nicht" ODER Weiter ohne Auswahl wird eindeutig
    // als übersprungen gespeichert — nie stillschweigend als „Nein" gedeutet.
    const skipped =
      question.type === 'yesnoskip' && yesNoSkip !== 'yes' && yesNoSkip !== 'no';
    advance({ value: collectValue(), note, skipped, answeredAt: nowISO() });
  };

  const defer = () => advance({ deferred: true, answeredAt: nowISO() });
  const skip = () => advance({ skipped: true, answeredAt: nowISO() });
  const skipWholeModule = () => {
    skipModule(question.module);
    const skipped = [...state.skippedModules, question.module];
    const next = nextActiveAfter(question, state.answers, skipped);
    if (next) navigation.push('Question', { questionId: next.id });
    else navigation.push('Summary');
  };

  const requiredHard = question.required && !question.deferrable;
  const canContinue = !requiredHard || isValid();

  // ── Rendering pro Fragetyp ────────────────────────────────────────────────

  // Optionen: statisch definierte ODER dynamisch abgeleitet (D2 ← D1, P0-4)
  const allOptions: Option[] = [...answerOptionsFor(question, state.answers), ...customOptions];

  // Eigenes Ziel dauerhaft entfernen (P1-5): Langdruck auf eigenen Chip.
  const removeCustomOption = (key: string) => {
    Alert.alert(
      'Eigenen Eintrag entfernen?',
      'Er verschwindet aus der Auswahl. Deine übrigen Angaben bleiben.',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Entfernen',
          style: 'destructive',
          onPress: () => {
            setCustomOptions((prev) => prev.filter((o) => o.key !== key));
            setMultiKeys((prev) => prev.filter((k) => k !== key));
          },
        },
      ],
    );
  };

  const renderInput = () => {
    switch (question.type) {
      case 'info':
        return (
          <Card>
            <Body muted>{question.hint}</Body>
          </Card>
        );
      case 'voice':
        return (
          <View>
            <Card>
              <View style={{ alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.s }}>
                <View
                  accessibilityLabel="Mikrofon (folgt mit Release 2)"
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 42,
                    backgroundColor: colors.surfaceAlt,
                    borderWidth: 2,
                    borderColor: colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontSize: 34 }}>🎙️</Text>
                </View>
                <Caption>Spracheingabe folgt mit Release 2 — nutze bitte die Tastatur.</Caption>
              </View>
            </Card>
            <Textarea
              value={textValue}
              onChangeText={setTextValue}
              placeholder="Schreib oder diktiere hier deine Gedanken …"
            />
          </View>
        );
      case 'text':
        return (
          <Textarea
            value={textValue}
            onChangeText={setTextValue}
            placeholder="Deine Antwort (optional ausführlich)"
            multiline={false}
          />
        );
      case 'textarea':
        return (
          <Textarea value={textValue} onChangeText={setTextValue} placeholder="Deine Antwort …" />
        );
      case 'year':
        return (
          <View>
            <Textarea
              value={year}
              onChangeText={(t) => setYear(t.replace(/[^0-9]/g, '').slice(0, 4))}
              placeholder="z. B. 1999"
              multiline={false}
              keyboardType="number-pad"
            />
            {isMinor ? (
              <Card style={{ marginTop: spacing.l }}>
                <Body style={{ fontWeight: '600', fontFamily: fonts.body.semibold, marginBottom: spacing.s }}>
                  Mynds ist aktuell für Erwachsene (18+)
                </Body>
                <Body muted style={{ fontSize: 14, lineHeight: 20 }}>
                  Wir arbeiten an einem altersgerechten Angebot. Wenn es dir gerade nicht gut geht, ist die
                  Telefonseelsorge (0800 111 0 111) jederzeit für dich da — auch für Jugendliche.
                </Body>
              </Card>
            ) : year.length > 0 && !ageOk ? (
              <Caption color={colors.warning} style={{ marginTop: spacing.s }}>
                Bitte eine vierstellige Jahreszahl zwischen 1900 und heute.
              </Caption>
            ) : null}
          </View>
        );
      case 'single':
        return (
          <ChipGroup
            options={allOptions}
            selected={singleKey ? [singleKey] : []}
            onToggle={(key) => setSingleKey(key)}
          />
        );
      case 'ranking':
        return (
          <ChipGroup
            options={allOptions}
            selected={singleKey ? [singleKey] : []}
            onToggle={(key) => setSingleKey(key)}
          />
        );
      case 'multi':
        return (
          <View>
            <ChipGroup
              options={allOptions}
              selected={multiKeys}
              multi
              onToggle={(key) => {
                setMaxHint(false);
                setMultiKeys((prev) => {
                  if (prev.includes(key)) return prev.filter((k) => k !== key);
                  const max = question.maxSelection;
                  if (max && prev.length >= max) {
                    setMaxHint(true);
                    return prev;
                  }
                  return [...prev, key];
                });
              }}
              onLongPressOption={removeCustomOption}
            />
            {maxHint ? (
              <Caption color={colors.warning} style={{ marginTop: spacing.s }}>
                Maximal {question.maxSelection} Angaben — gern unten eine eigene formulieren.
              </Caption>
            ) : null}
            {question.allowCustom ? (
              <View style={{ marginTop: spacing.l, flexDirection: 'row', gap: spacing.s, alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Textarea
                    value={customDraft}
                    onChangeText={setCustomDraft}
                    placeholder="Eigenes Ziel formulieren …"
                    multiline={false}
                  />
                </View>
                <Button
                  label="Hinzufügen"
                  variant="secondary"
                  disabled={customDraft.trim().length === 0}
                  onPress={() => {
                    const label = customDraft.trim();
                    const key = `custom:${label}`;
                    setCustomOptions((prev) => [...prev, { key, label }]);
                    setMultiKeys((prev) =>
                      question.maxSelection && prev.length >= question.maxSelection
                        ? prev
                        : [...prev, key],
                    );
                    setCustomDraft('');
                  }}
                />
              </View>
            ) : null}
          </View>
        );
      case 'slider':
        return (
          <SliderField
            {...question.slider!}
            value={sliderValue}
            onChange={setSliderValue}
          />
        );
      case 'yesno':
        return (
          <View>
            <ChipGroup
              options={[
                { key: 'yes', label: 'Ja' },
                { key: 'no', label: 'Nein' },
              ]}
              selected={yesNo === null ? [] : [yesNo ? 'yes' : 'no']}
              onToggle={(key) => setYesNo(key === 'yes')}
            />
            {yesNo === true && question.followUpText ? (
              <Textarea
                value={followText}
                onChangeText={setFollowText}
                placeholder={question.followUpText}
                multiline={false}
              />
            ) : null}
          </View>
        );
      case 'yesnoskip':
        return (
          <View>
            <ChipGroup
              options={[
                { key: 'yes', label: 'Ja' },
                { key: 'no', label: 'Nein' },
                { key: 'skip', label: 'Lieber nicht beantworten' },
              ]}
              selected={yesNoSkip ? [yesNoSkip] : []}
              onToggle={(key) => setYesNoSkip(key as 'yes' | 'no' | 'skip')}
            />
          </View>
        );
      default:
        return null;
    }
  };

  const showCrisis = question.crisisOnYes && yesNoSkip === 'yes';

  return (
    <Screen>
      <StorageBanner />
      <ProgressBar progress={(index + 1) / steps.length} />
      <View style={{ marginTop: spacing.l }}>
        <ModuleHeader
          moduleTitle={meta.title}
          optional={meta.optional}
          stepLabel={`Schritt ${index + 1} von ${steps.length}`}
        />
      </View>

      <Title style={{ marginTop: spacing.xl }}>{question.prompt}</Title>
      {question.hint && question.type !== 'info' ? (
        <Body muted style={{ marginTop: spacing.s }}>
          {question.hint}
        </Body>
      ) : null}
      {question.why ? <WhyHint text={question.why} /> : null}

      <View style={{ marginTop: spacing.l }}>{renderInput()}</View>

      {showCrisis ? (
        <View style={{ marginTop: spacing.l }}>
          <CrisisCard />
          <Caption style={{ marginTop: spacing.m }}>
            Deine Antwort wird nicht ausgewertet. Wenn du magst, kannst du später im Vorbereitungs-Ordner eine
            Notiz für dein Therapiegespräch anlegen.
          </Caption>
        </View>
      ) : null}

      <View style={{ marginTop: spacing.xxl, gap: spacing.s }}>
        {question.type === 'ack' ? (
          <Button label={question.ackLabel ?? 'Weiter'} onPress={submit} />
        ) : (
          <Button label="Weiter" onPress={submit} disabled={!canContinue || isMinor} />
        )}

        {question.type === 'info' && meta.optional ? (
          <Button label="Ganzen Block überspringen" variant="secondary" onPress={skipWholeModule} />
        ) : null}
        {question.required && question.deferrable ? (
          <Button label="Später beantworten" variant="ghost" onPress={defer} />
        ) : null}
        {!question.required &&
        question.type !== 'info' &&
        question.type !== 'ack' &&
        question.type !== 'yesnoskip' ? (
          <Button label="Überspringen" variant="ghost" onPress={skip} />
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={{ marginTop: spacing.l, alignSelf: 'flex-start' }}
        hitSlop={8}
      >
        <Caption>← Zurück</Caption>
      </Pressable>

      {question.metricKey ? (
        <View style={{ marginTop: spacing.l }}>
          <Caption color={colors.accent}>
            Diese Angabe startet dein Tracking zu diesem Thema.
          </Caption>
        </View>
      ) : null}
    </Screen>
  );
}

/** Nächster aktiver Katalog-Eintrag nach der gegebenen Frage. */
function nextActiveAfter(
  current: QuestionDef,
  answers: import('../onboarding/types').Answers,
  skippedModules: string[],
): QuestionDef | undefined {
  const from = catalog.findIndex((q) => q.id === current.id);
  for (let i = from + 1; i < catalog.length; i++) {
    const q = catalog[i];
    if (skippedModules.includes(q.module)) continue;
    if (q.showIf && !q.showIf(answers)) continue;
    return q;
  }
  return undefined;
}
