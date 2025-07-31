export function getTrafficInfo(state: number): {
  color: string;
  label: string;
} {
  switch (state) {
    case 4:
      return { color: '#32CD32', label: '원활' };
    case 3:
      return { color: '#FFD700', label: '서행' };
    case 2:
      return { color: '#FF4500', label: '정체' };
    case 1:
      return { color: '#300101', label: '매우정체' };
    default:
      return { color: '#242323', label: '정보없음' };
  }
}
