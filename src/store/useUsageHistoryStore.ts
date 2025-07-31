import { getUsageHistory } from '@/domains/MyPage/api/profile';
import type { UsageHistoryItem } from '@/domains/MyPage/types/profile';
import { create } from 'zustand';

interface UsageHistoryState {
  usageHistory: UsageHistoryItem[];
  fetchUsageHistory: () => Promise<void>;
}

export const useUsageHistoryStore = create<UsageHistoryState>((set) => ({
  usageHistory: [],
  fetchUsageHistory: async () => {
    try {
      const response = await getUsageHistory();

      set({ usageHistory: response.data });
    } catch (error) {
      console.error('사용 내역을 가져오는 데 실패했습니다.', error);
    }
  },
}));
