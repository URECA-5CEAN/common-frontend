import type { UsageHistoryItem } from '@/domains/MyPage/types/profile';

interface HistoryItemProps {
  item: UsageHistoryItem;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => (
  <div className="flex border border-gray-200 rounded-2xl px-4 py-5 justify-between">
    <div className="flex gap-[10px]">
      <p className="text-xs text-gray-500 h-6 flex items-center">{item.date}</p>
      <div className="flex flex-col gap-2">
        <p>{item.store}</p>
        <p className="text-xs text-gray-500">{item.time}</p>
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <p>{item.benefit}</p>
      <p className="text-xs text-gray-500 flex justify-end">
        경험치 +{item.experience}
      </p>
    </div>
  </div>
);

interface HistoryListProps {
  items: UsageHistoryItem[];
}

const HistoryList: React.FC<HistoryListProps> = ({ items }) => (
  <div className="flex flex-col gap-2">
    {items.map((item) => (
      <HistoryItem key={item.id} item={item} />
    ))}
  </div>
);

export default HistoryList;
