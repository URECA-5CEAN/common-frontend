import type { StoreRank } from '@/domains/Explore/types/rank';
import medalGold from '@/assets/icons/medal_gold.png';
import medalSilver from '@/assets/icons/medal_silver.png';
import medalBronze from '@/assets/icons/medal_bronze.png';

type StoreRankingListProps = {
  rankList: StoreRank[];
};

const cellBaseClass = 'flex items-center justify-center';
const columnClass = {
  rank: `w-[10%] ${cellBaseClass} text-center font-bold`,
  store: 'w-[35%] flex flex-wrap gap-x-4 gap-y-1 items-center',
  category: `w-[15%] ${cellBaseClass} text-center`,
  address: `w-[30%] ${cellBaseClass} text-sm text-left`,
  usage: `w-[10%] ${cellBaseClass} text-center`,
};

const medals = [medalGold, medalSilver, medalBronze];

const StoreRankingList = ({ rankList }: StoreRankingListProps) => {
  return (
    <>
      <div className="mt-4 bg-[#E6F4F1] flex px-1 sm:px-4 py-2.5 sm:py-6 rounded-3xl justify-around items-center text-gray-700 font-bold whitespace-normal">
        <div className={columnClass.rank}>순위</div>
        <div className={columnClass.store}>매장</div>
        <div className={columnClass.category}>카테고리</div>
        <div className={columnClass.address}>주소</div>
        <div className={columnClass.usage}>이용횟수</div>
      </div>

      <ul>
        {rankList.map((store, index) => (
          <li
            key={store.id}
            className="flex sm:px-4 py-3.5 sm:py-4 justify-around items-center"
          >
            <div className={columnClass.rank}>
              {index < 3 ? (
                <img src={medals[index]} alt="메달" className="mx-auto" />
              ) : (
                <span className="text-xl">{index + 1}</span>
              )}
            </div>

            <div className={columnClass.store}>
              <img
                src={store.brandImageUrl}
                alt={store.brandName}
                className="w-6 h-6 object-contain rounded"
              />
              <span className="font-bold truncate whitespace-nowrap">
                {store.name}
              </span>
            </div>

            <div className={columnClass.category}>
              <span className="bg-[#d1f0e0] px-2 py-1 rounded-xl text-sm">
                {store.category}
              </span>
            </div>

            <div className={columnClass.address}>{store.address}</div>

            <div className={columnClass.usage}>{store.usageCount}회</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default StoreRankingList;
