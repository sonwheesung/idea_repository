import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { useAdsStore } from '@/features/ads/store';
import { useTheme } from '@/theme/use-theme';

// 하단 배너 — 메인·상세 화면의 Screen footer (docs/MONETIZATION_SYSTEM.md §2.1).
// 미수신·미초기화·구매자(Remove Ads)면 자리를 차지하지 않는다 — 빈 회색 띠 금지.
// 작성/편집·노트·자료 입력 화면에는 배치하지 않는다(CLAUDE.md §14 H). 하단 인셋은 Screen이 처리한다.
// ~~점선 플레이스홀더~~ → 2026-08-17 Phase 6 실배너로 교체(dev = Google 테스트 단위).
const UNIT_ID = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-2731473780180274/5348046046';

export function AdBanner() {
  const theme = useTheme();
  const ready = useAdsStore((s) => s.ready);
  const removeAds = useAdsStore((s) => s.removeAds);
  const [failed, setFailed] = useState(false);

  if (!ready || removeAds || failed) return null;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      <BannerAd
        unitId={UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdFailedToLoad={() => setFailed(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'center' },
});
