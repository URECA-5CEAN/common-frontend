export type UserRank = {
  rank: number;
  nickname: string;
  title: string;
  completePercentage: string;
  level: number;
  storeUsage: number;
};

export type StoreRank = {
  id: string;
  name: string;
  usageCount: number;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  brandName: string;
  brandImageUrl: string;
};
