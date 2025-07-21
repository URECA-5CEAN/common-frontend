import type { UserRank } from './UserTotalRanking';
import medalGold from '@/assets/icons/medal_gold.png';
import medalSilver from '@/assets/icons/medal_silver.png';
import medalBronze from '@/assets/icons/medal_bronze.png';

type RankingListProps = {
  rankList: UserRank[];
};

const medals = [medalGold, medalSilver, medalBronze];

const RankingList = ({ rankList }: RankingListProps) => {
  // 임의 데이터
  const username = 'neo348_20';

  return (
    <>
      <div className="mt-4 bg-[#F9EBCE] flex py-3.5 sm:py-6 px-4 rounded-3xl justify-around text-gray-500 font-bold">
        <div className="w-[15%] text-center">순위</div>
        <div className="w-[30%]">닉네임</div>
        <div className="w-[20%] text-center">도감 완성률</div>
        <div className="w-[15%] text-center">레벨</div>
        <div className="w-[20%] text-center">혜택 받은 횟수</div>
      </div>

      <ul className=" divide-y-2 divide-dashed divide-[#C3B69C]">
        {rankList.map((user, index) => (
          <li
            key={index}
            className={`flex py-3.5 sm:py-6 sm:px-4 justify-around ${user.nickname === username ? 'sticky bottom-4 bg-[#BBE3E6] rounded-2xl' : ''}`}
          >
            <div className="w-[15%] text-center flex items-center justify-center text-xl font-bold">
              {index < 3 ? (
                <img src={medals[index]} alt="메달" className=" mx-auto" />
              ) : (
                <span>{user.rank}</span>
              )}
            </div>
            <div className="w-[30%] flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span className="font-bold break-all">{user.nickname}</span>
              <span className="bg-red-300 px-2 py-1 rounded-2xl text-center w-fit whitespace-nowrap">
                {user.title}
              </span>
            </div>
            <div className="w-[20%] flex items-center justify-center">
              {user.completion}
            </div>
            <div className="w-[15%] flex items-center justify-center">
              Lv .{user.level}
            </div>
            <div className="w-[20%] flex items-center justify-center">
              {user.benefitCount}회
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RankingList;
