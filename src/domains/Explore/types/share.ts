export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  brand: string;
  type: string;
  date: string;
  place: string;
  isClosed: boolean;
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
