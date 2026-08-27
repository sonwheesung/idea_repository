import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import i18n, { detectDeviceLanguage, SUPPORTED_LANGUAGES, type AppLanguage } from '@/lib/i18n';

interface LanguageState {
  /** 현재 UI 언어 — 항상 en|ko. ~~override null = 시스템 언어 따르기~~ → 2026-08-27 제거: 첫 실행에 기기 언어로 한 번 정해지고 그 뒤는 사용자 선택 */
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

function isSupported(v: unknown): v is AppLanguage {
  return typeof v === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(v);
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: detectDeviceLanguage(),
      setLanguage: (lang) => {
        set({ language: lang });
        void i18n.changeLanguage(lang);
      },
    }),
    {
      name: 'idearepository-language',
      storage: createJSONStorage(() => AsyncStorage),
      // 구 저장 형식 { override: 'ko' | null } → language. null(시스템)이었으면 지금 기기 언어로 고정
      merge: (persisted, current) => {
        const p = persisted as Partial<LanguageState & { override: AppLanguage | null }> | undefined;
        const language = isSupported(p?.language)
          ? p.language
          : isSupported(p?.override)
            ? p.override
            : current.language;
        return { ...current, language };
      },
      onRehydrateStorage: () => (state) => {
        // 저장된 선택을 부팅 시 적용 (i18n 초기값은 기기 언어 — 같으면 no-op)
        if (state && state.language !== i18n.language) void i18n.changeLanguage(state.language);
      },
    },
  ),
);
