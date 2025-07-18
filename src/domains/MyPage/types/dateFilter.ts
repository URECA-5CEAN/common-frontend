export type RangeType = '오늘' | '1개월' | '6개월' | '1년' | '직접 설정';

export interface DateRange {
  type: RangeType;
  startDate: Date;
  endDate: Date;
}
