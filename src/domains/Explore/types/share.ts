export interface Author {
  id: string;
  name: string;
  email: string;
  address: string;
  gender: 'male' | 'female' | string;
  title: string;
  membership: string;
  nickname: string;
}

export interface Post {
  postId: string;
  title: string;
  content: string;
  author: Author;
  category: string;
  brandName: string;
  benefitName: string;
  promiseDate: string; // ISO 문자열 (예: "2025-07-29T06:10:00")
  location: string;
  brandImgUrl: string;
  // isClosed: boolean;
  isMine?: boolean;
  storeName: string;
  storeLatitude: number;
  storeLongitude: number;
}

export interface PostWriteRequest {
  title: string;
  content: string;
  category: string;
  brandId: string;
  benefitId: string;
  promiseDate: string;
  // location: string;
  storeId: string;
}

export interface TimeValue {
  period: '오전' | '오후';
  hour: string;
  minute: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  category: string;
  latitude: number;
  longitude: number;
  brandName: string;
  brandImageUrl: string;
}
