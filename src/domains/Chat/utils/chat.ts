export const timeLabel = (lastMessageTime: string) => {
  const date = new Date(lastMessageTime);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (diffDays >= 1) return '어제';
  if (diffHours >= 1) return `${diffHours}시간 전`;
  return '방금 전';
};
