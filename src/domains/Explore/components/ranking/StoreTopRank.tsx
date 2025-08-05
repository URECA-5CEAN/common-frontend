import type { StoreRank } from '../../types/rank';
import { MapPin, BarChart3 } from 'lucide-react';

const RankCard = ({ store, rank }: { store: StoreRank; rank: number }) => {
  const cardStyles = {
    1: 'bg-white transform scale-105 shadow-xl p-3 md:p-4',
    2: 'bg-white shadow-lg p-3 md:p-4',
    3: 'bg-white shadow-lg p-3 md:p-4',
  };

  const rankIconStyles = {
    1: 'text-[#5AC5FF]',
    2: 'text-[#A0D8F1]',
    3: 'text-[#BEE9FF]',
  };

  return (
    <div
      className={`relative bg-white/95 backdrop-blur-xl rounded-2xl group transition-all duration-500 ease-out hover:-translate-y-2 w-full max-w-xs scale-95 min-h-[240px] sm:min-h-[260px] md:min-h-[280px] ${cardStyles[rank as keyof typeof cardStyles]}`}
    >
      <div className="flex flex-col h-full justify-between">
        <div
          className={`text-2xl sm:text-3xl font-bold ${rankIconStyles[rank as keyof typeof rankIconStyles]} mb-1`}
        >
          {rank}
        </div>

        {/* 브랜드 이미지 */}
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl bg-gradient-to-br border border-white/20 flex items-center justify-center text-white font-bold shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <img
              src={store.brandImageUrl}
              alt={store.name}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-13 md:h-13 rounded-xl"
            />
          </div>
        </div>

        {/* 매장 이름 */}
        <div className="text-center mb-3 flex-shrink-0">
          <h3 className="font-bold text-gray-800 mb-1 line-clamp-1 text-sm md:text-base">
            {store.name}
          </h3>
          <span className="inline-block px-2 sm:px-3 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r">
            {store.category}
          </span>
        </div>

        {/* 정보 섹션 */}
        <div className="space-y-1 flex-1 flex flex-col justify-end">
          <div className="flex items-center p-2 rounded-lg bg-gray-50/70">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-gray-700 text-xs leading-tight truncate">
              {store.address}
            </span>
          </div>

          <div className="flex items-center p-2 rounded-lg bg-gray-50/70">
            <BarChart3 className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-gray-700 text-xs">
              이용횟수:{' '}
              <span className="font-semibold">{store.usageCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopRankSection = ({ topStores }: { topStores: StoreRank[] }) => {
  return (
    <div className="w-full py-8 md:py-12 bg-white rounded-lg shadow-inner">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 px-4">
        {/* 모바일/태블릿 */}
        <div className="lg:hidden flex flex-col items-center gap-4 w-full">
          <RankCard store={topStores[0]} rank={1} />
          <RankCard store={topStores[1]} rank={2} />
          <RankCard store={topStores[2]} rank={3} />
        </div>

        {/* 데스크톱 */}
        <div className="hidden lg:flex flex-row items-center justify-center gap-4 md:gap-8">
          <RankCard store={topStores[1]} rank={2} />
          <RankCard store={topStores[0]} rank={1} />
          <RankCard store={topStores[2]} rank={3} />
        </div>
      </div>
    </div>
  );
};

export default TopRankSection;
