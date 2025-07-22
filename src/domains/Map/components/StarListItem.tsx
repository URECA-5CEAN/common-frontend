import { Map } from 'lucide-react';

export default function StarListItem() {
  return (
    <div className="border-b border-gray-200 space-y-1 flex">
      <div>
        <p className="font-semibold">할리스 OO점</p>
        <p className="text-xs w-60 truncate">
          내용내용내용내용내용내용내용내용내용내용용내용내용내용
        </p>
      </div>
      <Map
        className="border border-gray-200 rounded-full p-1 mt-2 hover:bg-gray-200"
        size={30}
      />
    </div>
  );
}
