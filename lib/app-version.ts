// 앱 버전 — **네이티브(스토어) 버전이 진실**이다.
//
// OTA(expo-updates)가 켜지면 `Constants.expoConfig.version`은 OTA 매니페스트 값으로 덮어써진다. 그 값을
// 버전 게이트(BootGate·소프트 업데이트 팝업)나 문의 appVersion에 쓰면, 네이티브가 1.0.10인 기기가 OTA를 받은 뒤
// 자기를 1.0.11이라고 보고해 "업데이트 안내가 영영 안 뜨는" 오염이 생긴다(LinkMemo OTA_UPDATE §6 실사례).
// 그래서 버전을 읽는 곳은 전부 여기 하나만 쓴다 — docs/OTA_SYSTEM.md §6. `check:ota`가 직접 읽기를 잡는다.
import * as Application from 'expo-application';
import Constants from 'expo-constants';

export const APP_VERSION: string =
  Application.nativeApplicationVersion ?? Constants.expoConfig?.version ?? '0.0.0';
