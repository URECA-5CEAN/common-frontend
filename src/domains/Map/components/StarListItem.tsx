import { Map } from 'lucide-react';
import type { StoreInfo } from '../api/store';

interface StarListProps {
  bookmark: StoreInfo;
  onCenter: () => void;
  onRoadClick: () => void;
}

export default function StarListItem({
  bookmark,
  onCenter,
  onRoadClick,
}: StarListProps) {
  return (
    <div className="border-b border-gray-200 space-y-1 flex justify-between cursor-pointer hover:bg-gray-50">
      <div onClick={onRoadClick}>
        <p className="font-semibold">{bookmark.name}</p>
        <p className="text-xs w-60 truncate">{bookmark.address}</p>
      </div>
      <Map
        className="border border-gray-200 rounded-full p-1 mt-2 hover:bg-gray-200 cursor-pointer"
        size={30}
        onClick={(e) => {
          e.stopPropagation();
          onCenter();
        }}
      />
    </div>
  );
}
