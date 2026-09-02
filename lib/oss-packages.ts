/**
 * 번들에 들어가는 오픈소스 패키지 — **생성 파일이다. 손으로 고치지 마라.**
 *
 * 만드는 곳: `scripts/make-licenses.mjs` (`npm run licenses:build`)
 * 어긋남 검사: `npm run check:licenses` — 의존성을 더하고 이 파일을 안 만들면 실패한다
 */

export interface OssPackage {
  name: string;
  version: string;
  license: string;
  copyright: string;
}

export const OSS_PACKAGES: readonly OssPackage[] = [
  {
    name: '@expo/vector-icons',
    version: '15.1.1',
    license: 'MIT',
    copyright: 'Copyright (c) 2015 Joel Arvidsson',
  },
  {
    name: '@react-native-async-storage/async-storage',
    version: '2.2.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2015-present, Facebook, Inc.',
  },
  {
    name: '@react-native-community/datetimepicker',
    version: '8.4.4',
    license: 'MIT',
    copyright: 'Copyright (c) 2019 React Native Community',
  },
  { name: '@react-native-community/slider', version: '5.0.1', license: 'MIT', copyright: '' },
  {
    name: '@react-navigation/bottom-tabs',
    version: '7.18.16',
    license: 'MIT',
    copyright: 'Copyright (c) 2017 React Navigation Contributors',
  },
  {
    name: '@react-navigation/elements',
    version: '2.9.38',
    license: 'MIT',
    copyright: 'Copyright (c) 2017 React Navigation Contributors',
  },
  {
    name: '@react-navigation/native',
    version: '7.3.16',
    license: 'MIT',
    copyright: 'Copyright (c) 2017 React Navigation Contributors',
  },
  { name: 'dayjs', version: '1.11.22', license: 'MIT', copyright: 'Copyright (c) 2018-present, iamkun' },
  {
    name: 'es-hangul',
    version: '2.4.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2024 Viva Republica, Inc',
  },
  { name: 'expo', version: '54.0.36', license: 'MIT', copyright: '' },
  { name: 'expo-application', version: '7.0.8', license: 'MIT', copyright: '' },
  { name: 'expo-constants', version: '18.0.13', license: 'MIT', copyright: '' },
  { name: 'expo-crypto', version: '15.0.9', license: 'MIT', copyright: '' },
  { name: 'expo-document-picker', version: '14.0.8', license: 'MIT', copyright: '' },
  { name: 'expo-file-system', version: '19.0.24', license: 'MIT', copyright: '' },
  { name: 'expo-font', version: '14.0.12', license: 'MIT', copyright: '' },
  { name: 'expo-haptics', version: '15.0.8', license: 'MIT', copyright: '' },
  { name: 'expo-image', version: '3.0.11', license: 'MIT', copyright: '' },
  { name: 'expo-linking', version: '8.0.12', license: 'MIT', copyright: '' },
  { name: 'expo-localization', version: '17.0.9', license: 'MIT', copyright: '' },
  { name: 'expo-router', version: '6.0.24', license: 'MIT', copyright: '' },
  { name: 'expo-secure-store', version: '15.0.8', license: 'MIT', copyright: '' },
  { name: 'expo-sharing', version: '14.0.8', license: 'MIT', copyright: '' },
  { name: 'expo-splash-screen', version: '31.0.13', license: 'MIT', copyright: '' },
  { name: 'expo-sqlite', version: '16.0.10', license: 'MIT', copyright: '' },
  { name: 'expo-status-bar', version: '3.0.9', license: 'MIT', copyright: '' },
  { name: 'expo-symbols', version: '1.0.8', license: 'MIT', copyright: '' },
  { name: 'expo-system-ui', version: '6.0.9', license: 'MIT', copyright: '' },
  { name: 'expo-updates', version: '29.0.20', license: 'MIT', copyright: '' },
  { name: 'expo-web-browser', version: '15.0.11', license: 'MIT', copyright: '' },
  { name: 'i18next', version: '26.3.6', license: 'MIT', copyright: 'Copyright (c) 2011-present i18next' },
  {
    name: 'react',
    version: '19.1.0',
    license: 'MIT',
    copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.',
  },
  {
    name: 'react-dom',
    version: '19.1.0',
    license: 'MIT',
    copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.',
  },
  {
    name: 'react-i18next',
    version: '17.0.11',
    license: 'MIT',
    copyright: 'Copyright (c) 2015-present i18next',
  },
  {
    name: 'react-native',
    version: '0.81.5',
    license: 'MIT',
    copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.',
  },
  {
    name: 'react-native-gesture-handler',
    version: '2.28.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2016 Software Mansion <swmansion.com>',
  },
  {
    name: 'react-native-google-mobile-ads',
    version: '16.0.0',
    license: 'Apache-2.0',
    copyright: 'Copyright (c) 2021-present Invertase Limited <oss@invertase.io>',
  },
  {
    name: 'react-native-reanimated',
    version: '4.1.7',
    license: 'MIT',
    copyright: 'Copyright (c) 2016 Software Mansion <swmansion.com>',
  },
  {
    name: 'react-native-safe-area-context',
    version: '5.6.2',
    license: 'MIT',
    copyright: 'Copyright (c) 2019 Th3rd Wave',
  },
  {
    name: 'react-native-screens',
    version: '4.16.0',
    license: 'MIT',
    copyright: 'Copyright (c) 2018 Software Mansion <swmansion.com>',
  },
  {
    name: 'react-native-web',
    version: '0.21.2',
    license: 'MIT',
    copyright: 'Copyright (c) Nicolas Gallagher.',
  },
  { name: 'react-native-worklets', version: '0.5.1', license: 'MIT', copyright: 'Copyright (c) 2024 nobody' },
  { name: 'zustand', version: '5.0.15', license: 'MIT', copyright: 'Copyright (c) 2019 Paul Henschel' },
];
