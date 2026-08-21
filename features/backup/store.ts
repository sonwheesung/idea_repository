import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 마지막 내보내기 시각 — 설정 행 부제·백업 화면 표시용(docs/BACKUP_SYSTEM.md §3·§5).
// "공유 시트가 정상 반환한 시각"이지 보관 보장이 아니다. 백업 파일 자체엔 들어가지 않는다(기기 환경값).
interface BackupState {
  lastExportedAt: number | null;
  markExported: (at: number) => void;
}

export const useBackupStore = create<BackupState>()(
  persist(
    (set) => ({
      lastExportedAt: null,
      markExported: (at) => set({ lastExportedAt: at }),
    }),
    { name: 'idearepository-backup', storage: createJSONStorage(() => AsyncStorage) },
  ),
);
