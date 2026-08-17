import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/theme/use-theme';

/**
 * 하단 배너 자리 — 메인·상세 화면의 Screen footer (docs/MONETIZATION_SYSTEM.md §2.1).
 * Phase 6(광고 SDK) 전까지는 점선 플레이스홀더로 레이아웃을 미리 검증한다(2026-08-17 사용자 요청, LinkMemo 선례).
 * 실배너로 교체 시 규칙: 미수신·미초기화·구매자(Remove Ads)면 이 영역 자체를 그리지 않는다(빈 띠 금지).
 * 작성/편집·노트·자료 입력 화면에는 배치하지 않는다(CLAUDE.md §14 H). 하단 인셋은 Screen(SafeAreaView bottom)이 처리한다.
 */
export function AdBanner() {
  const theme = useTheme();

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <View style={[styles.placeholder, { borderColor: theme.border }]}>
        <Text style={[styles.text, { color: theme.textMuted }]}>Banner Ad</Text>
      </View>
    </View>
  );
}

// ANCHORED_ADAPTIVE 배너의 폰 기준 높이(≈50~60dp)에 맞춘 자리
const styles = StyleSheet.create({
  wrap: { borderTopWidth: StyleSheet.hairlineWidth, paddingHorizontal: 12, paddingTop: 6 },
  placeholder: {
    height: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  text: { fontSize: 12 },
});
