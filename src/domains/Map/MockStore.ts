import benefitImage from '@/assets/image/BenefitImage.svg';
export interface Benefit {
  id: string;
  title: string;
  description?: string;
  available: boolean; // 지금 받을 수 있으면 true
  usedCount: number; // 내가 지금까지 사용한 횟수
}

export interface RankingItem {
  rank: number;
  benefitId: string;
  usedCount: number;
}

export interface brandInfo {
  id: string;
  name: string;
  image_url: string;
}

export interface StoreInfo {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
  lat: number;
  lng: number;
  openHours: string; // ex) "09:00 ~ 익일 02:00"
  isBookmarked: boolean; // 즐겨찾기 상태
  isVIP: boolean; // VIP 티켓 보유 여부
  benefits: Benefit[]; // 주요 혜택 리스트
  history: {
    // 내 도감(혜택 사용) 현황
    benefitId: string;
    usedCount: number;
  }[];
  ranking: RankingItem[]; // 혜택별 전체 사용량 순위
}

export const mockStores: StoreInfo[] = [
  {
    id: 'cgv-00',
    name: 'CGV 00점',
    imageUrl: benefitImage,
    description: '최신 상영관과 편안한 좌석을 갖춘 프리미엄 영화관입니다.',
    lat: 37.50123,
    lng: 127.03945,
    openHours: '09:00 ~ 익일 02:00',
    isBookmarked: true,
    isVIP: true,
    benefits: [
      {
        id: 'vip-1for1',
        title: 'VIP 1+1 (월 1회)',
        available: true,
        usedCount: 0,
      },
      {
        id: 'popcorn-free',
        title: '팝콘 무료 제공',
        description: '대형 팝콘 무료 교환권',
        available: false,
        usedCount: 1,
      },
    ],
    history: [
      { benefitId: 'vip-1for1', usedCount: 1 },
      { benefitId: 'popcorn-free', usedCount: 1 },
    ],
    ranking: [
      { rank: 1, benefitId: 'vip-1for1', usedCount: 200 },
      { rank: 2, benefitId: 'popcorn-free', usedCount: 150 },
      { rank: 3, benefitId: 'ticket-discount', usedCount: 120 },
      { rank: 4, benefitId: 'drink-upgrade', usedCount: 80 },
      { rank: 5, benefitId: 'seat-upgrade', usedCount: 50 },
    ],
  },
  {
    id: 'hallys-01',
    name: '할리스 커피 00점',
    imageUrl: benefitImage,
    description: '포근한 분위기와 다양한 시그니처 음료가 매력적인 카페입니다.',
    lat: 37.50234,
    lng: 127.04056,
    openHours: '08:00 ~ 22:00',
    isBookmarked: false,
    isVIP: false,
    benefits: [
      {
        id: 'drink-1free',
        title: '음료 1잔 무료',
        available: true,
        usedCount: 0,
      },
      {
        id: 'stamp-5bonus',
        title: '스탬프 5개 보너스',
        available: true,
        usedCount: 0,
      },
    ],
    history: [
      { benefitId: 'drink-1free', usedCount: 0 },
      { benefitId: 'stamp-5bonus', usedCount: 1 },
    ],
    ranking: [
      { rank: 1, benefitId: 'drink-1free', usedCount: 220 },
      { rank: 2, benefitId: 'stamp-5bonus', usedCount: 180 },
      { rank: 3, benefitId: 'cake-10off', usedCount: 90 },
      { rank: 4, benefitId: 'wifi-free', usedCount: 60 },
      { rank: 5, benefitId: 'seat-comfort', usedCount: 40 },
    ],
  },
  // …추가 매장 데이터를 여기에 이어서 작성…
];
