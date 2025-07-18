export interface Badge {
  id: string;
  name: string;
  description: string;
}

export interface UsageHistoryItem {
  id: number;
  date: string;
  time: string;
  store: string;
  benefit: string;
  experience: number;
}

export interface UserInfo {
  nickname: string;
  level: number;
  currentExp: number;
  maxExp: number;
  location: string;
  grade: string;
  collectionCount: number;
  totalCollection: number;
  missionCount: number;
  totalMission: number;
}
