import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { useTheme } from '@/theme/use-theme';

interface DialogProps {
  title: string;
  children: ReactNode;
  /** 확인 버튼 라벨(기본 common.save) */
  confirmLabel?: string;
  confirmDisabled?: boolean;
  /** 취소 버튼 라벨(기본 common.cancel) */
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * 가운데 다이얼로그 껍데기 — 카테고리 이름/삭제 · 단어 · 자료 다이얼로그가 같은 것을 쓴다(docs/UI_GUIDE.md §5.4, 2026-08-23).
 * 모달은 Screen 밖(별도 창)이라 키보드 회피를 직접 한다. 배경 탭 = 취소.
 */
export function Dialog({
  title,
  children,
  confirmLabel,
  confirmDisabled,
  cancelLabel,
  onConfirm,
  onCancel,
}: DialogProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Modal transparent animationType="fade" onRequestClose={onCancel}>
      <KeyboardAvoidingView behavior="padding" style={styles.flex}>
        <Pressable style={styles.backdrop} onPress={onCancel}>
          <Pressable style={[styles.dialog, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            {children}
            <View style={styles.actions}>
              <View style={styles.flex}>
                <Button label={cancelLabel ?? t('common.cancel')} variant="ghost" onPress={onCancel} />
              </View>
              <View style={styles.flex}>
                <Button
                  label={confirmLabel ?? t('common.save')}
                  onPress={onConfirm}
                  disabled={confirmDisabled}
                />
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
