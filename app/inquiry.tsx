import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { Select, type SelectOption } from '@/components/select';
import { TextField } from '@/components/text-field';
import { commonServer, ensureDeviceSession } from '@/features/support/server';
import { CONTENT_MAX, CONTENT_MIN, type SupportCategory } from '@/lib/common-server';
import { useTheme } from '@/theme/use-theme';

const CATEGORIES: SupportCategory[] = ['bug', 'suggestion', 'question', 'etc'];

// 문의 작성 — 서버로 나가는 유일한 사용자 입력 (ARCHITECTURE §1). 기기 세션으로 귀속(실패 시 익명 폴백).
// 폼 규약: 선택형은 Select, 텍스트는 Label+input (CLAUDE.md §14 M)
export default function InquiryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const [category, setCategory] = useState<SupportCategory>('bug');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);

  const categoryOptions: SelectOption<SupportCategory>[] = CATEGORIES.map((c) => ({
    value: c,
    label: t(`inquiry.categories.${c}`),
  }));

  const send = async () => {
    setSending(true);
    await ensureDeviceSession();
    const r = await commonServer.sendInquiry(category, content);
    setSending(false);
    if (r.ok) {
      Alert.alert(t('inquiry.sentTitle'), t('inquiry.sentBody'), [
        { text: t('common.done'), onPress: () => router.back() },
      ]);
      return;
    }
    // 실패해도 본문을 지우지 않는다 — 재시도할 수 있게 (SDK 규약)
    const message =
      r.reason === 'too-short'
        ? t('inquiry.tooShort', { min: CONTENT_MIN })
        : r.reason === 'rate-limited'
          ? t('inquiry.rateLimited')
          : r.reason === 'offline'
            ? t('inquiry.offline')
            : t('inquiry.failed');
    Alert.alert(t('inquiry.failedTitle'), message);
  };

  return (
    <Screen hasHeader scroll contentStyle={styles.form}>
      <Select
        label={t('inquiry.category')}
        value={category}
        options={categoryOptions}
        onChange={setCategory}
      />
      <TextField
        label={t('inquiry.content')}
        value={content}
        onChangeText={setContent}
        placeholder={t('inquiry.placeholder')}
        multiline
        maxLength={CONTENT_MAX}
        style={styles.content}
      />
      <Button
        label={t('inquiry.send')}
        onPress={() => void send()}
        disabled={sending || content.trim().length < CONTENT_MIN}
      />
      <Text style={[styles.privacy, { color: theme.textMuted }]}>{t('inquiry.privacyNote')}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { padding: 16, gap: 16, paddingBottom: 24 },
  content: { minHeight: 140 },
  privacy: { fontSize: 12, lineHeight: 18 },
});
