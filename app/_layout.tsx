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
import { initPurchases } from '@/features/purchase/purchases';
import { useTheme } from '@/theme/use-theme';

// 단일 메인 화면 + 스택 — 하단 네비 없음 (CLAUDE.md §14 C). BootGate = 점검/강제업데이트(실패 시 통과, ARCHITECTURE §5.2)
export default function RootLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  // 콜드 스타트 1회: 구매 상태 반영 → 동의(UMP) → SDK init → App Open(3시간 쿨타임).
  // 구매 확인을 광고보다 먼저 — 구매자에게 광고가 번쩍이지 않게(MONETIZATION §4·§4.1). 실패해도 앱을 막지 않는다.
  useEffect(() => {
    void initPurchases().then(initAds).then(maybeShowAppOpenAd);
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
        <Stack.Screen name="backup" options={{ title: t('settings.backup') }} />
        <Stack.Screen name="theme" options={{ title: t('settings.theme') }} />
        <Stack.Screen name="notice" options={{ title: t('settings.notice') }} />
        <Stack.Screen name="inquiries" options={{ title: t('settings.inquiry') }} />
        <Stack.Screen name="inquiry" options={{ title: t('inquiry.newTitle') }} />
        <Stack.Screen name="about" options={{ title: t('settings.about') }} />
        <Stack.Screen name="licenses" options={{ title: t('about.licenses') }} />
        {/* 발상 도구 — 광고 없음(작성 흐름). docs/IDEATION_SYSTEM.md */}
        <Stack.Screen name="idea-lab/index" options={{ title: t('ideation.title') }} />
        <Stack.Screen name="idea-lab/combine" options={{ title: t('ideation.tools.combine.title') }} />
        <Stack.Screen name="idea-lab/improve" options={{ title: t('ideation.tools.improve.title') }} />
        <Stack.Screen name="idea-lab/problem" options={{ title: t('ideation.tools.problem.title') }} />
        <Stack.Screen name="idea-lab/whatif" options={{ title: t('ideation.tools.whatif.title') }} />
        <Stack.Screen name="idea-lab/words" options={{ title: t('ideation.words.title') }} />
      </Stack>
      {/* 첫 실행 1회 프라이버시 웰컴 시트 (2026-08-17 사용자 결정) */}
      <WelcomeSheet />
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </BootGate>
  );
}
