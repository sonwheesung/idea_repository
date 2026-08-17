import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_SORT, SORT_KEYS, type SortKey } from '@/features/projects/query';
import { PRIORITIES, STATUSES, type Priority, type Status } from '@/features/projects/types';

interface FilterState {
  status: Status | null; // null = All
  categoryId: string | null;
  priority: Priority | null;
  sort: SortKey;
  setStatus: (s: Status | null) => void;
  setCategoryId: (id: string | null) => void;
  setPriority: (p: Priority | null) => void;
  setSort: (s: SortKey) => void;
  reset: () => void;
}

const DEFAULTS = { status: null, categoryId: null, priority: null, sort: DEFAULT_SORT } as const;

/** 필터·정렬 상태 — 로컬 유지(CLAUDE.md §14 J). 검색어는 세션 한정이라 여기 없다. */
export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setStatus: (status) => set({ status }),
      setCategoryId: (categoryId) => set({ categoryId }),
      setPriority: (priority) => set({ priority }),
      setSort: (sort) => set({ sort }),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name: 'idearepository-filter',
      storage: createJSONStorage(() => AsyncStorage),
      // 깨진 저장값·삭제된 카테고리는 기본으로 (카테고리 존재 여부는 화면에서 한 번 더 확인)
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<FilterState>;
        return {
          ...current,
          status: p.status && (STATUSES as readonly string[]).includes(p.status) ? p.status : null,
          categoryId: typeof p.categoryId === 'string' ? p.categoryId : null,
          priority: p.priority && (PRIORITIES as readonly string[]).includes(p.priority) ? p.priority : null,
          sort: p.sort && (SORT_KEYS as readonly string[]).includes(p.sort) ? p.sort : DEFAULT_SORT,
        };
      },
    },
  ),
);
