import { Map } from 'lucide-react';
import type { StoreInfo } from '../api/store';

interface StarListProps {
  bookmark: StoreInfo;
  onCenter: () => void;
}

export default function StarListItem({ bookmark, onCenter }: StarListProps) {
  return (
    <div className="border-b border-gray-200 space-y-1 flex">
      <div>
        <p className="font-semibold">{bookmark.name}</p>
        <p className="text-xs w-60 truncate">{bookmark.address}</p>
      </div>
      <Map
        className="border border-gray-200 rounded-full p-1 mt-2 hover:bg-gray-200"
        size={30}
        onClick={onCenter}
      />
    </div>
  );
}
