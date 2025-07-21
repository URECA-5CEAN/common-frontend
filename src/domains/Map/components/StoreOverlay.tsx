import { Share2, Star, Webcam } from 'lucide-react';
import { useCallback, useState } from 'react';
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

  // 로드뷰 토글 함수
  const changeLoadView = useCallback(() => {
    setIsRoad((prev) => !prev);
  }, []);
  return (
    <div className=" bg-white rounded-2xl  w-[360px] p-4 space-y-3 z-50">
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
        <p className="text-lg   mb-1">받을 수 있는 혜택</p>
        <p className="text-base text-gray-800">영화 티켓 1+1</p>
      </div>
      {/* 버튼  영역 */}
      <div className="flex justify-between ">
        <IconActionGroup
          actions={[
            { icon: <Star />, label: '즐겨찾기' },
            { icon: <Webcam />, label: '로드뷰', onClick: changeLoadView },
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
