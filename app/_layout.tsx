import '@/lib/i18n';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import { useTheme } from '@/theme/use-theme';

// 단일 메인 화면 + 스택 — 하단 네비 없음 (CLAUDE.md §14 C)
export default function RootLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.surface },
          headerTintColor: theme.text,
          contentStyle: { backgroundColor: theme.background },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="project/new" options={{ presentation: 'modal', title: t('project.new') }} />
        <Stack.Screen name="settings" options={{ title: t('common.settings') }} />
      </Stack>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </>
  );
}
