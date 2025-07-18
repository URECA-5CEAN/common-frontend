import type { Badge, UsageHistoryItem } from '@/domains/MyPage/types/profile';

export const BADGES: Badge[] = [
  {
    id: 'earlybird',
    name: '일찍 일어나는 새',
    description: '오전 9시 이전에 혜택을 5회 이상 받았어요',
  },
  {
    id: 'breadlover',
    name: '빵순이',
    description: '제과 혜택을 5회 이상 받았어요',
  },
  {
    id: 'icecoffee',
    name: '얼죽아',
    description: '추운 날씨에 아이스 아메리카노 혜택을 5회 이상 받았어요',
  },
];

export const USAGE_HISTORY: UsageHistoryItem[] = [
  {
    id: 1,
    date: '2025.07.18',
    time: '10:54',
    store: '할리스 커피 부산점',
    benefit: '아이스 아메리카노 1잔 무료',
    experience: 20,
  },
  {
    id: 2,
    date: '2025.07.10',
    time: '10:54',
    store: '할리스 커피 부산점',
    benefit: '아이스 아메리카노 1잔 무료',
    experience: 20,
  },
  {
    id: 3,
    date: '2025.05.10',
    time: '10:54',
    store: '할리스 커피 부산점',
    benefit: '아이스 아메리카노 1잔 무료',
    experience: 20,
  },
  {
    id: 4,
    date: '2024.12.10',
    time: '10:54',
    store: '할리스 커피 부산점',
    benefit: '아이스 아메리카노 1잔 무료',
    experience: 20,
  },
];
