import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import type { Resource, ResourceInput } from '@/features/resources/api';
import { suggestResourceTitle } from '@/features/resources/url';
import { useTheme } from '@/theme/use-theme';

interface ResourceDialogProps {
  initial: Resource | null;
  onCancel: () => void;
  /** 에러 문구(i18n 적용 후)를 반환하면 닫지 않는다 */
  onSubmit: (input: ResourceInput) => string | null;
}

/** 관련 자료 추가/수정 다이얼로그 — URL만 필수, 제목은 도메인으로 자동 제안 (PROJECT_SYSTEM §7) */
export function ResourceDialog({ initial, onCancel, onSubmit }: ResourceDialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [url, setUrl] = useState(initial?.url ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [error, setError] = useState<string | undefined>();

  const suggestion = url.trim() ? suggestResourceTitle(url) : '';

  const submit = () => {
    const err = onSubmit({ url, title: title.trim() || suggestion, description });
    if (err) setError(err);
  };

  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      {/* 모달은 Screen 밖(별도 창)이라 키보드 회피를 직접 */}
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable style={[styles.dialog, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {initial ? t('resource.edit') : t('resource.add')}
            </Text>
            <TextField
              label={t('resource.url')}
              required
              value={url}
              onChangeText={(v) => {
                setUrl(v);
                if (error) setError(undefined);
              }}
              error={error}
              placeholder="example.com/article"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              autoFocus={!initial}
            />
            <TextField
              label={t('resource.title')}
              value={title}
              onChangeText={setTitle}
              placeholder={suggestion || t('resource.titlePlaceholder')}
            />
            <TextField
              label={t('resource.description')}
              value={description}
              onChangeText={setDescription}
              placeholder={t('resource.descriptionPlaceholder')}
            />
            <View style={styles.actions}>
              <View style={styles.flex}>
                <Button label={t('common.cancel')} variant="ghost" onPress={onCancel} />
              </View>
              <View style={styles.flex}>
                <Button label={t('common.save')} onPress={submit} disabled={!url.trim()} />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  dialog: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 20, gap: 14 },
  title: { fontSize: 17, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 4 },
});
