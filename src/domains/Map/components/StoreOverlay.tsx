import { Share2, Star, Webcam } from 'lucide-react';
import { useState } from 'react';
import type { LatLng } from '../KakaoMapContainer';
import KakaoRoadview from '../KakaoRoadView';
import StartEndBtn from './StartEndBtn';
import IconActionGroup from './IconActionGroup';

const StoreOverlay = ({ lat, lng }: LatLng) => {
  const [isRoad, setIsRoad] = useState<boolean>(false);
  return (
    <div className=" bg-white rounded-2xl  w-[360px] p-4 space-y-3 z-10">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">CGV OO점</h3>
        </div>
        <span className="text-sm font-semibold text-primaryGreen-80 mr-4 mt-2">
          영업중
        </span>
        <button className="text-m text-primaryGreen  ">혜택 사용 가능</button>
      </div>

      {/* 혜택안내 영역 */}
      <div>
        <p className="text-lg  font-semibold mb-1">받을 수 있는 혜택</p>
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
