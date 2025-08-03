export interface Badge {
  title: string;
  reason: string;
}

export interface UsageHistoryItem {
  id: number;
  storeId: string;
  visitedAt: string;
  benefitAmount: number;
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
  error: boolean;
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
