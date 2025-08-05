import { Coffee, ShoppingBag, ShoppingCart, Car } from 'lucide-react';
import { Clapperboard, Gift, Percent, Ticket, Utensils } from 'lucide-react';
import type { CategoryIconMeta } from '../pages/MapPage';

// 혜택 타입 정의
export type BenefitType = '쿠폰' | '할인' | '증정';

export type CategoryType =
  | '음식점'
  | '카페'
  | '편의점'
  | '대형마트'
  | '문화시설'
  | '렌터카';

// 아이콘 매핑
export const benefitIconMap: Record<BenefitType, CategoryIconMeta> = {
  쿠폰: {
    icon: Ticket,
    color: '#fbbc04', // 노랑 등등 원하는 색
    size: 20,
  },
  할인: {
    icon: Percent,
    color: '#34c759', // 연두 등등 원하는 색
    size: 20,
  },
  증정: {
    icon: Gift,
    color: '#42a5f5', // 파랑 등등 원하는 색
    size: 20,
  },
};

export const categoryIconMap: Record<CategoryType, CategoryIconMeta> = {
  음식점: {
    icon: Utensils,
    color: '#FF7043',
    size: 20,
  },
  카페: {
    icon: Coffee,
    color: '#6D4C41',
    size: 20,
  },
  편의점: {
    icon: ShoppingBag,
    color: '#0ecc17',
    size: 20,
  },
  대형마트: {
    icon: ShoppingCart,
    color: '#db2f18',
    size: 20,
  },
  문화시설: {
    icon: Clapperboard,
    color: '#8E24AA',
    size: 20,
  },
  렌터카: {
    icon: Car,
    color: '#F4511E',
    size: 20,
  },
};
