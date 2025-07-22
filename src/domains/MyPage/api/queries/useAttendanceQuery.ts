import { useQuery } from '@tanstack/react-query';
import { getUserAttendance } from '@/domains/MyPage/api/mission';

export const useAttendanceQuery = (year: number, month: number) => {
  return useQuery({
    queryKey: ['attendance', year, month],
    queryFn: () => getUserAttendance(year, month),
    staleTime: 1000 * 60 * 5,
  });
};
