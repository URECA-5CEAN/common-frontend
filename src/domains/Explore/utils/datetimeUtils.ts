import type { TimeValue } from '../types/share';

export const convertTimeFormat = (time?: string): string => {
  if (!time) return '';

  const [hourStr, minute] = time.split(':');
  const hour = parseInt(hourStr, 10);

  const period = hour < 12 ? '오전' : '오후';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;

  return `${period} ${hour12}:${minute}`;
};

export const getDefaultTime = (interval = 10): TimeValue => {
  const now = new Date();

  const totalMinutes = now.getHours() * 60 + now.getMinutes();
  const roundedMinutes = Math.ceil(totalMinutes / interval) * interval;

  let hours24 = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;

  if (hours24 === 24) hours24 = 0;

  const period = hours24 < 12 ? '오전' : '오후';
  const hour12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  console.log(minutes);

  return {
    period,
    hour: hour12.toString(),
    minute: minutes.toString().padStart(2, '0'),
  };
};

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function toISOStringFromDateTime(date: string, time: TimeValue): string {
  let hour = parseInt(time.hour, 10);
  if (time.period === '오전') {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  const dateObj = new Date(
    `${date}T${String(hour).padStart(2, '0')}:${time.minute.padStart(2, '0')}:00`,
  );
  return dateObj.toISOString();
}
