import type { RangeType } from '@/domains/MyPage/types/dateFilter';

export const getStartDateByRange = (rangeType: RangeType): Date => {
  const today = new Date();

  switch (rangeType) {
    case '오늘':
      return new Date(today.setHours(0, 0, 0, 0));
    case '1개월': {
      const date = new Date(today);
      date.setMonth(date.getMonth() - 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    case '6개월': {
      const date = new Date(today);
      date.setMonth(date.getMonth() - 6);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    case '1년': {
      const date = new Date(today);
      date.setFullYear(date.getFullYear() - 1);
      date.setHours(0, 0, 0, 0);
      return date;
    }
    default:
      return new Date(today.setHours(0, 0, 0, 0));
  }
};

export const formatDate = (date?: Date): string => {
  if (!date) return '날짜 선택';

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}.${month}.${day}`;
};

export const normalizeDate = (date: Date, isEndDate: boolean): Date => {
  if (isEndDate) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999,
    );
  }

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
};
