import { Star, Webcam } from 'lucide-react';
import StartEndBtn from './StartEndBtn';
import IconActionGroup from './IconActionGroup';
import type { StoreInfo } from '../api/store';
import clsx from 'clsx';
import { useBenefitBrands } from '../hooks/useBenefitBrands';
import type { LocationInfo } from '../pages/MapPage';
import RoadviewViewer from './RoadviewView';
import { useState } from 'react';
import { Ring } from 'ldrs/react';

interface OverlayProps {
  lat: number;
  lng: number;
  store: StoreInfo;
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  toggleBookmark: (store: StoreInfo) => void;
  isBookmark: boolean;
}

const StoreOverlay = ({
  store,
  onStartChange,
  onEndChange,
  toggleBookmark,
  isBookmark,
}: OverlayProps) => {
  const {
    data: benefits = [],
    isLoading,
    isError,
    error,
  } = useBenefitBrands(store.brandName);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  if (isLoading)
    return <Ring size="24" stroke="3" bgOpacity="0" speed="2" color="white" />;
  if (isError) return `Error: ${error.message}`;
  if (benefits.length === 0) return '해당 브랜드 혜택이 없습니다.';
  return (
    <div
      className={clsx(
        'hidden sm:block   rounded-2xl  w-[360px] p-4 space-y-3 z-1',
        store.isRecommended
          ? 'bg-primaryGreen-40 relative bottom-5'
          : 'bg-white',
      )}
    >
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-bold text-gray-900 ">{store.name}</p>
        </div>

        <button className="text-m text-primaryGreen">혜택 사용 가능</button>
      </div>
      <span className="text-sm font-semibold text-primaryGreen-80 float-right">
        영업중
      </span>
      {/* 혜택안내 영역 */}
      <div>
        <p className="text-lg font-semibold mb-1">받을 수 있는 혜택</p>
        <p className="text-sm text-gray-800">{benefits[0].name}</p>
        <p className="text-sm text-gray-800">{benefits[0].description}</p>
      </div>
      {/* 버튼  영역 */}
      <div className="flex justify-between ">
        <IconActionGroup
          actions={[
            {
              icon: (
                <Star
                  className={clsx(
                    'cursor-pointer',
                    isBookmark
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300',
                  )}
                />
              ),
              label: '즐겨찾기',
              onClick: () => toggleBookmark(store),
            },
            {
              icon: <Webcam />,
              label: '로드뷰',
              onClick: () => setIsLoad(true),
            },
          ]}
        />
        {/* 출발/도착 버튼 */}
        <StartEndBtn
          onStartChange={onStartChange}
          onEndChange={onEndChange}
          store={store}
        />
      </div>
      {isLoad && (
        <RoadviewViewer
          location={{ lat: store.latitude, lng: store.longitude }}
        />
      )}
    </div>
  );
};

export default StoreOverlay;
