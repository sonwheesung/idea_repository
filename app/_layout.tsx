import '@/lib/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import { BootGate } from '@/components/boot-gate';
import { WelcomeSheet } from '@/components/welcome-sheet';
import { initAds } from '@/features/ads/ads';
import { maybeShowAppOpenAd } from '@/features/ads/app-open';
import { useTheme } from '@/theme/use-theme';

// 단일 메인 화면 + 스택 — 하단 네비 없음 (CLAUDE.md §14 C). BootGate = 점검/강제업데이트(실패 시 통과, ARCHITECTURE §5.2)
export default function RootLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  // 콜드 스타트 1회: 동의(UMP) → SDK init → App Open(3시간 쿨타임). 실패해도 앱을 막지 않는다 (MONETIZATION §2.2·§3)
  useEffect(() => {
    void initAds().then(maybeShowAppOpenAd);
  }, []);

  return (
    <BootGate>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="project/new" options={{ presentation: 'modal', title: t('project.new') }} />
        <Stack.Screen name="project/[id]/index" options={{ title: '' }} />
        <Stack.Screen
          name="project/[id]/edit"
          options={{ presentation: 'modal', title: t('project.edit') }}
        />
        <Stack.Screen name="settings" options={{ title: t('common.settings') }} />
        <Stack.Screen name="categories" options={{ title: t('settings.categories') }} />
        <Stack.Screen name="theme" options={{ title: t('settings.theme') }} />
        <Stack.Screen name="notice" options={{ title: t('settings.notice') }} />
        <Stack.Screen name="inquiries" options={{ title: t('settings.inquiry') }} />
        <Stack.Screen name="inquiry" options={{ title: t('inquiry.newTitle') }} />
        <Stack.Screen name="about" options={{ title: t('settings.about') }} />
      </Stack>
      {/* 첫 실행 1회 프라이버시 웰컴 시트 (2026-08-17 사용자 결정) */}
      <WelcomeSheet />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </BootGate>
  );
}
