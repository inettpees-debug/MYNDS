// A3 + A4 — Einwilligungen: granular, getrennt, einzeln widerrufbar.
// Basis (Art. 9 DSGVO) ist für den Betrieb erforderlich; die drei optionalen
// Einwilligungen sind entkoppelt — ohne sie funktioniert die App vollständig
// (Richtlinien.md §1.2: kein Kopplungsverbot-Verstoß).

import React, { useState } from 'react';
import { Pressable, Switch, View } from 'react-native';
import { Body, Button, Caption, Card, Screen, Title } from '../components/ui';
import { colors, spacing } from '../theme/tokens';
import { useOnboarding, nowISO } from '../onboarding/state';
import type { ConsentRecord } from '../onboarding/types';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Consent'>;

const POLICY_VERSION = '2026-10-r1';

interface ConsentToggleProps {
  title: string;
  description: string;
  required?: boolean;
  value: boolean;
  onValueChange: (v: boolean) => void;
  details?: string;
}

function ConsentToggle({ title, description, required, value, onValueChange, details }: ConsentToggleProps) {
  const [open, setOpen] = useState(false);
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.m }}>
        <View style={{ flex: 1 }}>
          <Body style={{ fontWeight: '600' }}>{title}</Body>
          {required ? (
            <Caption>erforderlich für die Nutzung</Caption>
          ) : (
            <Caption>optional · Widerruf derzeit nur über „Alles löschen“</Caption>
          )}
        </View>
        <Switch
          accessibilityLabel={title}
          value={value}
          onValueChange={onValueChange}
          disabled={required && value} // Basis-Einwilligung: nach Erteilung hier nicht mehr abstellbar (Widerruf = Daten löschen, im Dashboard)
          trackColor={{ true: colors.accentDeep, false: colors.track }}
          thumbColor={value ? colors.accent : colors.textMuted}
        />
      </View>
      <Body muted style={{ marginTop: spacing.m, ...{ fontSize: 14, lineHeight: 20 } }}>
        {description}
      </Body>
      {details ? (
        <Pressable onPress={() => setOpen(!open)} hitSlop={8} style={{ marginTop: spacing.s }}>
          <Caption color={colors.accent}>{open ? 'Details ausblenden' : 'Details einblenden'}</Caption>
        </Pressable>
      ) : null}
      {open && details ? (
        <View style={{ marginTop: spacing.s }}>
          <Caption>{details}</Caption>
        </View>
      ) : null}
    </Card>
  );
}

export function ConsentScreen({ navigation }: Props) {
  const { setConsents } = useOnboarding();
  const [basis, setBasis] = useState(false);
  const [cloudStt, setCloudStt] = useState(false);
  const [aiSupport, setAiSupport] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  const persistAndContinue = () => {
    const records: ConsentRecord[] = [
      { scope: 'basis', granted: basis, policyVersion: POLICY_VERSION, changedAt: nowISO() },
      { scope: 'cloud_stt', granted: cloudStt, policyVersion: POLICY_VERSION, changedAt: nowISO() },
      { scope: 'ai_support', granted: aiSupport, policyVersion: POLICY_VERSION, changedAt: nowISO() },
      { scope: 'analytics', granted: analytics, policyVersion: POLICY_VERSION, changedAt: nowISO() },
    ];
    setConsents(records);
    navigation.navigate('Safety');
  };

  return (
    <Screen>
      <Title>Deine Einwilligungen</Title>
      <Body muted style={{ marginTop: 8 }}>
        Weil es bei Mynds um deine psychische Befindlichkeit geht, gelten besondere Datenschutzregeln (Art. 9
        DSGVO). Jede Einwilligung entscheidest du einzeln. Ehrlich gesagt: Einzelnen Einwilligungen kannst du
        derzeit nur insgesamt widerrufen — über „Alles löschen“ in der App. Eine einzelne Widerruf-Möglichkeit
        folgt mit der nächsten Version.
      </Body>

      <View style={{ gap: 12, marginTop: 24 }}>
        <ConsentToggle
          title="Speichern meiner Angaben"
          description="Damit Mynds funktioniert, müssen deine Angaben gespeichert werden. Widerruf = Löschung deiner Daten."
          required
          value={basis}
          onValueChange={setBasis}
          details={'Gespeichert werden: deine Onboarding-Angaben, Notizen und Einstellungen — lokal auf deinem Gerät, derzeit noch unverschlüsselt als Prototyp. Verschlüsselung und Abgleich mit einem EU-Server folgen mit der Produktionsversion. Rechtsgrundlage: Art. 6 Abs. 1 lit. a i. V. m. Art. 9 Abs. 2 lit. a DSGVO. Deine Rechte: Auskunft, Berichtigung, Löschung, Export — direkt in der App.'}
        />
        <ConsentToggle
          title="Transkription in der Cloud"
          description="Nur falls die Verarbeitung auf deinem Gerät nicht reicht: bessere Texterkennung über einen EU-Dienst. Deine Aufnahmen werden danach dort gelöscht. (Im Prototyp noch nicht aktiv — die Einwilligung wird erst relevant, sobald die Funktion existiert.)"
          value={cloudStt}
          onValueChange={setCloudStt}
          details="Anbieter mit Auftragsverarbeitungsvertrag (AVV), EU-Region, kein Training mit deinen Daten, Übertragung verschlüsselt. Audio wird standardmäßig nach der Transkription gelöscht."
        />
        <ConsentToggle
          title="KI-Unterstützung"
          description="Zusammenfassungen und Vorschläge werden automatisch erzeugt — immer als Entwurf gekennzeichnet und erst nach deiner Prüfung gespeichert. (Im Prototyp noch nicht aktiv.)"
          value={aiSupport}
          onValueChange={setAiSupport}
          details={'EU AI Act: Alle automatisch erzeugten Inhalte sind in der App sichtbar als „automatisch erstellt“ markiert. Keine Auswertung deiner Symptom-Check-Antworten, keine Diagnose-, Risiko- oder Schweregrad-Ableitungen.'}
        />
        <ConsentToggle
          title="Anonyme Nutzungsstatistik"
          description="Hilft uns zu verstehen, welche Bereiche der App gut funktionieren — ohne Inhalte, ohne Personenbezug. (Im Prototyp noch nicht aktiv.)"
          value={analytics}
          onValueChange={setAnalytics}
          details="Privacy-first-Analyse (Plausible/Matomo), keine Cookies, keine Profilbildung, keine Weitergabe."
        />
      </View>

      <View style={{ marginTop: 24 }}>
        <Button
          label="Weiter"
          disabled={!basis}
          onPress={persistAndContinue}
        />
        {!basis ? (
          <Caption style={{ textAlign: 'center', marginTop: 8 }}>
            Ohne Speichereinwilligung kann Mynds leider nicht genutzt werden — ehrlich gesagt.
          </Caption>
        ) : null}
      </View>
    </Screen>
  );
}
