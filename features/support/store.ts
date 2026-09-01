import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { commonServer, ensureDeviceSession } from '@/features/support/server';
import type { Bootstrap } from '@/lib/common-server';

// 부팅 조회는 앱 실행당 1회. 실패해도 앱을 막지 않는다 — 게이트는 성공 응답에만 적용 (ARCHITECTURE §5.2)
interface BootState {
  boot: Bootstrap | null;
  fetched: boolean;
  fetchOnce: () => void;
}

export const useBootStore = create<BootState>()((set, get) => ({
  boot: null,
  fetched: false,
  fetchOnce: () => {
    if (get().fetched) return;
    set({ fetched: true });
    // 기기 세션 확보 — 활성 사용자 집계(ARCHITECTURE §5.5). bootstrap과 **병렬**: 서버가 양쪽에서 활성 일자를 멱등 기록하므로
    // 직렬로 맞출 이유가 없다. 실패(오프라인 등)는 false로 끝나고 UI에 쓰지 않는다 — 다음 부팅·문의 진입에 다시 시도할 뿐.
    void ensureDeviceSession();
    void commonServer.fetchBootstrap().then((r) => {
      if (r.ok) set({ boot: r.data });
    });
  },
}));

// 공지 읽음은 앱 로컬 — 서버에 읽음 테이블을 두지 않는다 (common 규약)
interface NoticeReadState {
  readIds: string[];
  markRead: (ids: string[]) => void;
}

export const useNoticeReadStore = create<NoticeReadState>()(
  persist(
    (set) => ({
      readIds: [],
      markRead: (ids) => set((s) => ({ readIds: Array.from(new Set([...s.readIds, ...ids])).slice(-200) })),
    }),
    { name: 'idearepository-notice-read', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

// 소프트 업데이트 "나중에" — latest 값당 1회 (ARCHITECTURE §5.4). 서버에 상태를 두지 않는다(공지 읽음과 같은 원칙)
interface SoftUpdateState {
  /** 마지막으로 "나중에"를 누른 latest 버전 문자열 */
  dismissedVersion: string | null;
  dismiss: (version: string) => void;
}

export const useSoftUpdateStore = create<SoftUpdateState>()(
  persist(
    (set) => ({
      dismissedVersion: null,
      dismiss: (version) => set({ dismissedVersion: version }),
    }),
    { name: 'idearepository-soft-update', storage: createJSONStorage(() => AsyncStorage) },
  ),
);

/** 안 읽은 공지 수 — 푸시가 없어 설정 행의 배지 점이 통지의 전부다 (조각·LinkMemo 승계) */
export function useUnreadNoticeCount(): number {
  const boot = useBootStore((s) => s.boot);
  const readIds = useNoticeReadStore((s) => s.readIds);
  if (!boot) return 0;
  return boot.announcements.filter((a) => !readIds.includes(a.id)).length;
}
