import { Search } from 'lucide-react';
import benefitImage from '@/assets/image/BenefitImage.svg';
export default function MapSection() {
  return (
    <div className="px-2 py-3 space-y-3">
      {/* 검색바 */}
      <div className="flex items-center border border-gray-200 rounded-2xl px-3 py-2 mb-4">
        <input
          type="text"
          placeholder="검색"
          className="flex-1 bg-transparent outline-none ml-2 text-sm"
        />
        <Search />
      </div>

      {/* 리스트 아이템 반복 */}
      {['할리스', '할리스'].map((i, idx) => (
        <div
          key={idx}
          className="flex items-center bg-white rounded-lg shadow p-3"
        >
          {/* 왼쪽 썸네일 */}
          <img
            src={benefitImage}
            alt={i}
            className="w-[100px] h-[100px] rounded-md mr-3"
          />
          {/* 텍스트 영역 */}
          <div className="flex-1 flex-col justify-between">
            <h3 className="text-sm font-medium ">{i}커피 00점</h3>
            <p className="text-xs text-gray-500 truncate">
              부분샘플 설명이 들어갑니다. 설명이 길면 말줄임으로 처리.
            </p>
            <div className="mt-1 flex items-center space-x-2 text-xs">
              <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                출발
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full">
                도착
              </span>
            </div>
          </div>
          {/* 즐겨찾기 버튼 */}
          <button className="ml-2">
            <svg className="w-5 h-5 text-yellow-400">{/* star icon */}</svg>
          </button>
        </div>
      ))}
    </div>
  );
}
