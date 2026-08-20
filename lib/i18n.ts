import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { koJosa, koJosaPick, type JosaPair } from '@/lib/josa';
import en from '@/locales/en.json';
import ko from '@/locales/ko.json';

// 초기 언어 en(기본)·ko — docs/I18N_SYSTEM.md §1. 언어 추가 = 리소스 + 이 배열 + check:i18n LANGS.
export const SUPPORTED_LANGUAGES = ['en', 'ko'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// 언어 자기표기 — 번역하지 않는다(각 언어 사용자가 자기 언어를 찾는 라벨)
export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  ko: '한국어',
};

/** 기기 언어 → 지원 언어. 미지원은 영어 폴백(글로벌 기본). */
export function detectDeviceLanguage(): AppLanguage {
  const code = Localization.getLocales()[0]?.languageCode ?? 'en';
  if ((SUPPORTED_LANGUAGES as readonly string[]).includes(code)) return code as AppLanguage;
  return 'en';
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
  lng: detectDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

// 한국어 조사 포매터 — ko 리소스에서 {{x, josa(pair: 이/가)}} · “{{w}}”{{w, josaPick(pair: 을/를)}} (I18N_SYSTEM §2)
i18n.services.formatter?.add('josa', (value, _lng, options) =>
  koJosa(String(value), options.pair as JosaPair),
);
i18n.services.formatter?.add('josaPick', (value, _lng, options) =>
  koJosaPick(String(value), options.pair as JosaPair),
);

export default i18n;
