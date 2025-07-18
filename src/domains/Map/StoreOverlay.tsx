import { Share2, Star, Webcam } from 'lucide-react';
import { useState } from 'react';
import type { LatLng } from './KakaoMapContainer';
import KakaoRoadview from './KakaoRoadView';

const StoreOverlay = ({ lat, lng }: LatLng) => {
  const [isRoad, setIsRoad] = useState<boolean>(false);
  return (
    <div className=" bg-white rounded-2xl shadow-lg w-[360px] p-4 space-y-3 z-10">
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
        <div className="flex space-x-2">
          <button className="flex items-center justify-center p-1.5  border border-gray-200 rounded-full hover:bg-gray-200">
            {/* 별 아이콘 */}
            <Star />
          </button>
          <button
            className="flex items-center justify-center p-1.5  border border-gray-200 rounded-full hover:bg-gray-200"
            onClick={() => setIsRoad(true)}
          >
            {/* 로드뷰 아이콘 */}
            <Webcam />
          </button>
          <button className="flex items-center justify-center p-1.5 border border-gray-200 rounded-full hover:bg-gray-200">
            {/* 공유 아이콘 */}
            <Share2 />
          </button>
        </div>
        {/* 출발/도착 버튼 */}
        <div className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden">
          <button className="px-3 py-1 text-sm font-semibold  hover:bg-primaryGreen hover:text-white focus:outline-none">
            출발
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <button className="px-3 py-1 text-sm font-semibold text-primaryGreen  hover:bg-primaryGreen hover:text-white  focus:outline-none">
            도착
          </button>
        </div>
      </div>
      {isRoad && <KakaoRoadview position={{ lat, lng }} />}
    </div>
  );
};

export default StoreOverlay;
