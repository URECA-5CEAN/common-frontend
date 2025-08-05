import { useEffect, useState } from 'react';
import type { Store } from '../../types/share';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { getNearbyStores } from '../../api/share';

interface SelectStoreModalProps {
  category: string | null;
  brand: string | null;
  onClose: () => void;
  onSelect: (store: Store) => void;
}

const SelectStoreModal = ({
  category,
  brand,
  onClose,
  onSelect,
}: SelectStoreModalProps) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || !brand) {
      setError('카테고리와 브랜드를 먼저 선택해주세요.');
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError('위치 정보를 가져올 수 없습니다.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const rawStores = await getNearbyStores(
            category,
            latitude,
            longitude,
          );

          const filtered = rawStores.filter(
            (store) =>
              store.brandName.trim().toLowerCase() ===
              brand.trim().toLowerCase(),
          );

          setStores(filtered);
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('위치 정보 접근이 거부되었습니다.');
        setLoading(false);
      },
    );
  }, [category, brand]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="주변 매장 선택"
      description={
        error
          ? error
          : loading
            ? '위치 기반 매장을 불러오는 중입니다...'
            : stores.length === 0
              ? `주변에 ${brand} 매장이 없습니다.`
              : undefined
      }
      actions={
        <Button variant="secondary" onClick={onClose} className="w-full">
          닫기
        </Button>
      }
    >
      {!loading && !error && stores.length > 0 && (
        <ul className="max-h-90 overflow-y-auto divide-y divide-gray-200">
          {stores.map((store) => (
            <li
              key={store.id}
              onClick={() => {
                onSelect(store);
                onClose();
              }}
              className="cursor-pointer py-4 hover:bg-gray-100 px-2"
            >
              <p className="font-medium">{store.name}</p>
              <p className="text-sm text-gray-500">{store.address}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default SelectStoreModal;
