import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdEventType, AppOpenAd, TestIds } from 'react-native-google-mobile-ads';

import { adsEnabled, useAdsStore } from '@/features/ads/store';
import { useOnboardingStore } from '@/features/onboarding/store';

// App Open 광고 — 콜드 스타트에만, 쿨타임 3시간 (docs/MONETIZATION_SYSTEM.md §2.2, CLAUDE.md §14 #2).
// 포그라운드 복귀에는 절대 띄우지 않는다(호출부가 콜드 스타트 1회만 부른다).
const UNIT_ID = __DEV__ ? TestIds.APP_OPEN : 'ca-app-pub-2731473780180274/9239189595';
const LAST_SHOWN_KEY = 'idearepository-appopen-last';
const COOLDOWN_MS = 3 * 60 * 60 * 1000;
const LOAD_TIMEOUT_MS = 8000;

// 광고 흐름이 끝났음을 알린다(안 띄움·실패·닫힘 모두)
const settle = () => useAdsStore.getState().setStartupAdSettled();

export async function maybeShowAppOpenAd(): Promise<void> {
  // 어떤 예외도 앱을 막지 않고, 신호도 반드시 풀린다
  await run().catch(settle);
}

// 첫 실행(웰컴 시트를 아직 안 닫음)에는 App Open을 띄우지 않는다. 광고가 시트를 덮으면 "Start"를 누르려던 탭이
// 광고 클릭이 된다(AdMob 실수 클릭 정책, 2026-11-02 실측, CLAUDE §14 X). 복원을 못 기다리면 안전한 쪽(안 띄움)으로 간다.
async function welcomePending(): Promise<boolean> {
  if (!useOnboardingStore.getState().hydrated) {
    await new Promise<void>((resolve) => {
      const timer = setTimeout(done, 3000);
      const unsubscribe = useOnboardingStore.subscribe((s) => {
        if (s.hydrated) done();
      });
      function done() {
        clearTimeout(timer);
        unsubscribe();
        resolve();
      }
    });
  }
  const { hydrated, welcomeSeen } = useOnboardingStore.getState();
  return !hydrated || !welcomeSeen;
}

async function run(): Promise<void> {
  if (!adsEnabled()) return settle();
  if (await welcomePending()) return settle();

  try {
    const last = Number((await AsyncStorage.getItem(LAST_SHOWN_KEY)) ?? 0);
    // 쿨타임이 안 지났으면 로드조차 하지 않는다 (트래픽 낭비 금지 — 로드 유효기간 4h와 조합)
    if (Date.now() - last < COOLDOWN_MS) return settle();
  } catch {
    return settle();
  }

  const ad = AppOpenAd.createForAdRequest(UNIT_ID);

  await new Promise<void>((resolve) => {
    let done = false;
    let shown = false;
    const finish = () => {
      if (!done) {
        done = true;
        resolve();
      }
      if (!shown) settle();
    };
    ad.addAdEventListener(AdEventType.LOADED, () => {
      if (done) return; // 타임아웃 뒤 늦게 로드된 광고는 띄우지 않는다
      void AsyncStorage.setItem(LAST_SHOWN_KEY, String(Date.now()));
      shown = true;
      ad.show().catch(() => {
        shown = false;
        settle();
      });
      finish();
    });
    ad.addAdEventListener(AdEventType.CLOSED, settle);
    ad.addAdEventListener(AdEventType.ERROR, finish);
    // 로드가 늦으면 포기한다 — 앱 시작을 광고가 붙잡지 않는다
    setTimeout(finish, LOAD_TIMEOUT_MS);
    ad.load();
  });
}
