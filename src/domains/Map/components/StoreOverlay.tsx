import { Share2, Star, Webcam } from 'lucide-react';
import { useState } from 'react';
import KakaoRoadview from '../KakaoRoadView';
import StartEndBtn from './StartEndBtn';
import IconActionGroup from './IconActionGroup';
import type { StoreInfo } from '../api/store';

interface OverlayProps {
  lat: number;
  lng: number;
  store: StoreInfo;
}

const StoreOverlay = ({ lat, lng, store }: OverlayProps) => {
  const [isRoad, setIsRoad] = useState<boolean>(false);
  return (
    <div className=" bg-white rounded-2xl  w-[360px] p-4 space-y-3 z-50">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-lg font-bold text-gray-900">{store.name}</p>
        </div>
        <span className="text-sm font-semibold text-primaryGreen-80 ml-2 mt-2">
          영업중
        </span>
        <button className="text-m text-primaryGreen  ">혜택 사용 가능</button>
      </div>

      {/* 혜택안내 영역 */}
      <div>
        <p className="text-lg   mb-1">받을 수 있는 혜택</p>
        <p className="text-base text-gray-800">영화 티켓 1+1</p>
      </div>
      {/* 버튼  영역 */}
      <div className="flex justify-between ">
        <IconActionGroup
          actions={[
            { icon: <Star />, label: '즐겨찾기' },
            { icon: <Webcam />, label: '로드뷰' },
            { icon: <Share2 />, label: '공유' },
          ]}
        />
        {/* 출발/도착 버튼 */}
        <StartEndBtn />
      </div>
      {isRoad && <KakaoRoadview position={{ lat, lng }} />}
    </div>
  );
};

export default StoreOverlay;
