// Smoke-Test: verifiziert, dass die Test-Infrastruktur (jest-expo + RNTL v14)
// mit dem bestehenden Stack (Expo 58 / RN 0.88 / React 19) läuft.
// RNTL v14: render() ist asynchron; Queries über `screen` nach Abschluss.
import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { catalog } from '../onboarding/catalog';

test('jest-expo + RNTL rendern eine React-Native-Komponente', async () => {
  await render(<Text>Hello Mynds</Text>);
  expect(screen.getByText('Hello Mynds')).toBeTruthy();
});

test('Katalog lädt und enthält die Kernfragen', () => {
  const ids = catalog.map((q) => q.id);
  expect(ids).toContain('C4');
  expect(ids).toContain('F10');
  expect(ids).toContain('G1');
});
