// MYNDS UI-Bausteine — Designsystem in Code (src/theme/tokens.ts).
// Grundsätze: Dark Mode primär, ruhige visuelle Sprache, keine Alarmfarben
// für Nutzerzustände, KI-Inhalte ausschließlich Lavendel (ai) gekennzeichnet.

import React, { useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { colors, radius, spacing, type } from '../theme/tokens';
import { Option } from '../onboarding/types';

// ─── Typografie ─────────────────────────────────────────────────────────────

export function Display({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[type.display, { color: colors.textPrimary }, style]}>{children}</Text>;
}

export function Title({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[type.title, { color: colors.textPrimary }, style]}>{children}</Text>;
}

export function Body({
  children,
  muted,
  style,
}: {
  children: React.ReactNode;
  muted?: boolean;
  style?: object;
}) {
  return (
    <Text style={[type.body, { color: muted ? colors.textSecondary : colors.textPrimary }, style]}>
      {children}
    </Text>
  );
}

export function Caption({
  children,
  style,
  color,
}: {
  children: React.ReactNode;
  style?: object;
  color?: string;
}) {
  return <Text style={[type.caption, { color: color ?? colors.textMuted }, style]}>{children}</Text>;
}

// ─── Flächen ────────────────────────────────────────────────────────────────

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={styles.screenContent}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }
  return <View style={[styles.screenContent, { flex: 1, backgroundColor: colors.bg }]}>{children}</View>;
}

// ─── Buttons ────────────────────────────────────────────────────────────────

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}) {
  const btnStyle =
    variant === 'primary'
      ? styles.buttonPrimary
      : variant === 'secondary'
        ? styles.buttonSecondary
        : styles.buttonGhost;
  const labelColor =
    variant === 'primary' ? colors.onAccent : variant === 'secondary' ? colors.textPrimary : colors.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.buttonBase, btnStyle, pressed && { opacity: 0.85 }, disabled && { opacity: 0.4 }]}
    >
      <Text style={[type.bodySmall, { fontWeight: '600', color: disabled ? colors.textMuted : labelColor }]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Auswahl-Chips ──────────────────────────────────────────────────────────

export function ChipGroup({
  options,
  selected,
  onToggle,
  multi,
  onLongPressOption,
}: {
  options: Option[];
  selected: string[];
  onToggle: (key: string) => void;
  multi?: boolean;
  /** Optional (z. B. eigene Ziele): Langdruck entfernt die Option dauerhaft. */
  onLongPressOption?: (key: string) => void;
}) {
  return (
    <View style={styles.chipWrap}>
      {options.map((opt) => {
        const isSel = selected.includes(opt.key);
        const isCustom = opt.key.startsWith('custom:');
        return (
          <Pressable
            key={opt.key}
            accessibilityRole={multi ? 'checkbox' : 'radio'}
            accessibilityState={{ selected: isSel }}
            accessibilityHint={
              isCustom && onLongPressOption
                ? 'Doppeltippen zum Auswählen oder Abwählen, lang drücken zum Entfernen.'
                : undefined
            }
            onPress={() => onToggle(opt.key)}
            onLongPress={isCustom && onLongPressOption ? () => onLongPressOption(opt.key) : undefined}
            style={[styles.chip, isSel && styles.chipSelected]}
          >
            <Text style={[type.bodySmall, { color: isSel ? colors.onAccent : colors.textSecondary }]}>
              {isCustom && onLongPressOption ? `${opt.label} ✕` : opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Slider mit Wortankern ──────────────────────────────────────────────────

export function SliderField({
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel,
  midLabel,
  maxLabel,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  minLabel: string;
  midLabel?: string;
  maxLabel: string;
}) {
  return (
    <View style={{ marginTop: spacing.xl }}>
      <View style={styles.sliderValueRow}>
        <Text style={[type.display, { color: colors.accent, fontSize: 40, lineHeight: 46 }]}>{value}</Text>
      </View>
      <Slider
        accessibilityLabel={`Skala von ${minLabel} bis ${maxLabel}`}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.track}
        thumbTintColor={colors.accent}
        onValueChange={onChange}
      />
      <View>
        <Caption>{minLabel}</Caption>
        {midLabel ? (
          <Text style={[type.caption, { color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs }]}>
            {midLabel}
          </Text>
        ) : null}
        <Caption style={{ textAlign: 'right' }}>{maxLabel}</Caption>
      </View>
    </View>
  );
}

// ─── Text-Eingaben ──────────────────────────────────────────────────────────

export function Textarea({
  value,
  onChangeText,
  placeholder,
  multiline = true,
  keyboardType = 'default',
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
}) {
  return (
    <TextInput
      accessibilityLabel={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textMuted}
      multiline={multiline}
      keyboardType={keyboardType}
      style={[styles.textarea, !multiline && { minHeight: 52 }]}
    />
  );
}

// ─── Fortschritt & Modul-Kopf ───────────────────────────────────────────────

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  return (
    <View>
      <View style={styles.trackBar}>
        <View style={[styles.fillBar, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

export function ModuleHeader({
  moduleTitle,
  stepLabel,
  optional,
}: {
  moduleTitle: string;
  stepLabel?: string;
  optional?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.s }}>
      <Caption color={colors.accent} style={{ letterSpacing: 1.2, textTransform: 'uppercase' }}>
        {moduleTitle}
      </Caption>
      {optional ? (
        <View style={styles.optionalPill}>
          <Caption color={colors.textMuted}>freiwillig</Caption>
        </View>
      ) : null}
      {stepLabel ? <Caption style={{ marginLeft: 'auto' }}>{stepLabel}</Caption> : null}
    </View>
  );
}

// ─── "Warum fragen wir das?" (Progressive Disclosure) ───────────────────────

export function WhyHint({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginTop: spacing.m }}>
      <Pressable accessibilityRole="button" onPress={() => setOpen(!open)} hitSlop={8}>
        <Caption color={colors.accent}>Warum fragen wir das?</Caption>
      </Pressable>
      {open ? (
        <Card style={{ marginTop: spacing.s }}>
          <Body muted style={type.bodySmall}>
            {text}
          </Body>
        </Card>
      ) : null}
    </View>
  );
}

// ─── KI-Kennzeichnung (AI Act Art. 50) ──────────────────────────────────────

export function AiBadge({ label = 'automatisch erstellt' }: { label?: string }) {
  return (
    <View style={styles.aiBadge}>
      <Caption color={colors.ai}>{`⚙ ${label}`}</Caption>
    </View>
  );
}

// ─── Krisen-Hilfekarte (ruhig, kein Alarm-Rot; E2.3 der Planung) ────────────

export const CRISIS_NUMBERS = [
  { label: 'Telefonseelsorge (kostenlos, rund um die Uhr)', number: '0800 111 0 111' },
  { label: 'Telefonseelsorge (2. Linie)', number: '0800 111 0 222' },
  { label: 'Ärztlicher Bereitschaftsdienst', number: '116 117' },
  { label: 'Notruf', number: '112' },
];

export function CrisisCard({ heading }: { heading?: string }) {
  return (
    <Card style={{ borderLeftWidth: 3, borderLeftColor: colors.accent }}>
      <Body style={{ fontWeight: '600', marginBottom: spacing.s }}>
        {heading ?? 'Diese Gedanken sind schwer — und du musst sie nicht allein tragen.'}
      </Body>
      <Body muted style={type.bodySmall}>
        Es gibt Menschen, die dir sofort zuhören. Ein Anruf kostet dich nichts und verpflichtet dich zu nichts.
      </Body>
      <View style={{ marginTop: spacing.l, gap: spacing.m }}>
        {CRISIS_NUMBERS.map((n) => (
          <View key={n.number}>
            <Body style={{ fontWeight: '600' }}>{n.number}</Body>
            <Caption>{n.label}</Caption>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.l,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  buttonBase: {
    borderRadius: radius.md,
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonPrimary: { backgroundColor: colors.accent },
  buttonSecondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
  buttonGhost: { backgroundColor: 'transparent' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s, marginTop: spacing.l },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
  chipSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
  sliderValueRow: { alignItems: 'center' },
  trackBar: {
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.track,
    overflow: 'hidden',
  },
  fillBar: { height: 4, backgroundColor: colors.accent },
  optionalPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: 2,
  },
  aiBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.ai,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.m,
    paddingVertical: 3,
    marginTop: spacing.s,
  },
  textarea: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.l,
    color: colors.textPrimary,
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: spacing.l,
    ...type.body,
  },
});

// AccessibilityInfo-Import bleibt für spätere Screenreader-Ankündigungen
// (z. B. bei Slider-Änderungen) bewusst referenziert.
void AccessibilityInfo;
