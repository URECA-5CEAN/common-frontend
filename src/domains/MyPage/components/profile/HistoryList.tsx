import type { UsageHistoryItem } from '@/domains/MyPage/types/profile';
import dolphinFind from '@/assets/image/dolphin_find.png';

interface HistoryItemProps {
  item: UsageHistoryItem;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const original = item.visitedAt;
  const date = original.split('T')[0].replace(/-/g, '.');
  const time = original.split('T')[1].slice(0, 5);

  return (
    <div className="flex border border-gray-200 rounded-2xl px-4 py-5 justify-between">
      <div className="flex gap-[10px]">
        <p className="text-xs text-gray-500 h-6 flex items-center">{date}</p>
        <div className="flex flex-col gap-2">
          <p>{item.storeId}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p>{item.benefitAmount.toLocaleString()}원 할인</p>
        <p className="text-xs text-gray-500 flex justify-end">
          {/* 경험치 +{item.experience} */}
        </p>
      </div>
    </div>
  );
};

interface HistoryListProps {
  items: UsageHistoryItem[];
}

const HistoryList: React.FC<HistoryListProps> = ({ items }) => {
  return items.length > 0 ? (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <HistoryItem key={item.id} item={item} />
      ))}
    </div>
  ) : (
    <div className="w-full flex flex-col items-center py-10">
      <img
        src={dolphinFind}
        alt="무언가를 찾는 돌고래 캐릭터"
        className="w-[150px]"
      />
      사용내역이 없어요
    </div>
  );
};
export default HistoryList;
