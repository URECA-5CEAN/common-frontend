import { Search } from 'lucide-react';
import StoreCard from './StoreCard';

interface MapSectionProps {
  openDetail: (item: string) => void;
}
export default function MapSection({ openDetail }: MapSectionProps) {
  return (
    <div className="px-2 py-3 space-y-3 min-h-dvh">
      {/* 검색바 */}
      <div className="flex items-center border border-gray-200 rounded-2xl px-3 py-2 mb-4">
        <input
          type="text"
          placeholder="검색"
          className="flex-1 bg-transparent outline-none ml-2 text-sm"
        />
        <Search />
      </div>

      {/* 리스트 아이템 반복 */}
      {['할리스', '할리스', '할리스', '할리스'].map((i, idx) => (
        <StoreCard item={i} key={idx} openDetail={openDetail} />
      ))}
    </div>
  );
}
