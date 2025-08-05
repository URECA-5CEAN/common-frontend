import type { StoreRank } from '@/domains/Explore/types/rank';
import medalGold from '@/assets/icons/medal_gold.png';
import medalSilver from '@/assets/icons/medal_silver.png';
import medalBronze from '@/assets/icons/medal_bronze.png';

type StoreRankingListProps = {
  rankList: StoreRank[];
};

const rowClass = 'flex w-full px-4 py-4 items-center';
const cellBaseClass = 'flex items-center justify-center';
const columnClass = {
  rank: `flex-[1] ${cellBaseClass} text-center font-bold`,
  store: `flex-[2] font-bold flex gap-x-4 gap-y-1 flex-wrap sm:flex-nowrap items-center min-w-0`,
  category: `flex-[1.5] ${cellBaseClass} text-center `,
  address: `flex-[1.5] ${cellBaseClass} text-center`,
  usage: `flex-[1] ${cellBaseClass} text-center `,
};

const medals = [medalGold, medalSilver, medalBronze];

const StoreRankingList = ({ rankList }: StoreRankingListProps) => {
  return (
    <>
      <div
        className={`${rowClass} mt-4 py-6 bg-[#E6F4F1] rounded-3xl text-gray-600 font-bold`}
      >
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
            className={`${rowClass} text-gray-800 text-sm sm:text-base flex sm:px-4 py-3.5 sm:py-4 justify-around items-center`}
          >
            <div className={columnClass.rank}>
              {index < 3 ? (
                <img
                  src={medals[index]}
                  alt="메달"
                  className="mx-auto sm:w-11 sm:h-11 w-8 h-8 object-contain"
                />
              ) : (
                <span className="text-base sm:text-xl">{index + 1}</span>
              )}
            </div>

            <div className={columnClass.store}>
              <img
                src={store.brandImageUrl}
                alt={store.brandName}
                className="w-6 h-6 sm:w-12 sm:h-12 object-contain rounded"
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
