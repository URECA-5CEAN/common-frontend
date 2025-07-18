import { Search, Star } from 'lucide-react';
import benefitImage from '@/assets/image/BenefitImage.svg';

interface MapSectionProps {
  openDetail: (item: string) => void;
}
export default function MapSection({ openDetail }: MapSectionProps) {
  return (
    <div className="px-2 py-3 space-y-3 min-h-dvh">
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
      {['할리스', '할리스', '할리스', '할리스'].map((i, idx) => (
        <div
          key={idx}
          className="flex items-stretch bg-white"
          onClick={() => openDetail(i)}
        >
          {/* 왼쪽 썸네일 */}
          <img
            src={benefitImage}
            alt={i}
            className="w-[100px] h-[100px] rounded-md mr-3"
          />
          {/* 텍스트 영역 */}
          <div className="flex flex-1 mt-2 flex-col justify-between space-y-2 h-full ">
            <p className="text-lg font-semibold ">{i}커피 00점</p>
            <p className=" text-xs text-gray-500 line-clamp-2 w-44 ">
              부분샘플 설명이 들어갑니다. 설명이 길면 말줄임으로 처리.설명이
              길면 말줄임으로 처리.
            </p>
            <div className="flex justify-between">
              <div className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden">
                <button className="px-3 py-1 text-sm font-semibold  hover:bg-primaryGreen hover:text-white focus:outline-none">
                  출발
                </button>
                <div className="w-px h-6 bg-gray-300" />
                <button className="px-3 py-1 text-sm font-semibold text-primaryGreen  hover:bg-primaryGreen hover:text-white  focus:outline-none">
                  도착
                </button>
              </div>
              <Star />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
