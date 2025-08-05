import { Button } from '@/components/Button';
import type { Store } from '../../types/share';

interface PlaceFieldProps {
  selectedStore: Store | null;
  onOpen: () => void;
}

const PlaceField = ({ selectedStore, onOpen }: PlaceFieldProps) => {
  return (
    <div className="mb-6 flex gap-1 items-center">
      <label className="mr-2 font-bold">장소</label>
      <div className="flex gap-2 items-center">
        <span className="text-gray-800 font-medium rounded-2xl p-3 border border-gray-200">
          {selectedStore?.name || '선택된 장소 없음'}
        </span>
      </div>
      <Button onClick={onOpen} variant="ghost">
        장소 선택
      </Button>
    </div>
  );
};

export default PlaceField;
