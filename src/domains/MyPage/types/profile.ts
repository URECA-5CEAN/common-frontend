export interface Badge {
  title: string;
  reason: string;
}

export interface UsageHistoryItem {
  id: number;
  date: string;
  time: string;
  store: string;
  date: string;
  time: string;
  benefitAmount: number;
  experience: number;
}

export interface UserInfo {
  collectionCount: number;
  totalCollection: number;
  missionCount: number;
  totalMission: number;
}

export interface UserInfoApi {
  address: string;
  email: string;
  gender: string;
  id: string;
  membership: string;
  name: string;
  nickname: string;
  title: string;
  level: number;
  exp: number;
}

export interface UserInfoResponse {
  statusCode: number;
  message: string;
  data: UserInfoApi;
}

export interface UserStatResponse {
  statusCode: number;
  message: string;
  data: UserInfoApi;
}
