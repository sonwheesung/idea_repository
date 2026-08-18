import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { formatDay } from '@/lib/date';
import { useTheme } from '@/theme/use-theme';

interface DateFieldProps {
  label: string;
  /** 'YYYY-MM-DD' | null — 시각·시간대 없는 날짜 문자열 (CLAUDE.md §14 D) */
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  warning?: string;
}

const DAY = 'YYYY-MM-DD';

/** 날짜 필드 — 라벨 + 현재 값 행, 탭하면 OS 날짜 피커. 지우기 아이콘으로 null. */
export function DateField({ label, value, onChange, placeholder, warning }: DateFieldProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [iosOpen, setIosOpen] = useState(false);
  const [iosDraft, setIosDraft] = useState<Date>(new Date());
  const current = value ? dayjs(value, DAY).toDate() : new Date();

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: current,
        mode: 'date',
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(dayjs(date).format(DAY));
        },
      });
    } else {
      setIosDraft(current);
      setIosOpen(true);
    }
  };

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={open}
          style={({ pressed }) => [
            styles.field,
            { backgroundColor: theme.searchBar, borderColor: theme.border, opacity: pressed ? 0.85 : 1 },
          ]}>
          <Text style={[styles.value, { color: value ? theme.text : theme.textMuted }]}>
            {value ? formatDay(value) : (placeholder ?? '')}
          </Text>
          <Ionicons name="calendar-outline" size={18} color={theme.icon} />
        </Pressable>
        {value ? (
          <Pressable
            hitSlop={8}
            accessibilityLabel={t('common.clear')}
            onPress={() => onChange(null)}
            style={styles.clear}>
            <Ionicons name="close-circle" size={22} color={theme.textMuted} />
          </Pressable>
        ) : null}
      </View>
      {warning ? <Text style={[styles.warning, { color: theme.danger }]}>{warning}</Text> : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={iosOpen} transparent animationType="fade" onRequestClose={() => setIosOpen(false)}>
          <Pressable
            style={[styles.backdrop, { paddingBottom: 16 + insets.bottom }]}
            onPress={() => setIosOpen(false)}>
            <Pressable style={[styles.sheet, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <DateTimePicker
                value={iosDraft}
                mode="date"
                display="spinner"
                onChange={(_e, date) => date && setIosDraft(date)}
                themeVariant={theme.isDark ? 'dark' : 'light'}
              />
              <Button
                label={t('common.done')}
                onPress={() => {
                  onChange(dayjs(iosDraft).format(DAY));
                  setIosOpen(false);
                }}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: { fontSize: 16 },
  clear: { padding: 2 },
  warning: { fontSize: 12 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end', padding: 16 },
  sheet: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 16, gap: 12 },
});
