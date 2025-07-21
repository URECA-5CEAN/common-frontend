import type { UserRank } from './UserTotalRanking';
import medalGold from '@/assets/icons/medal_gold.png';
import medalSilver from '@/assets/icons/medal_silver.png';
import medalBronze from '@/assets/icons/medal_bronze.png';

type RankingListProps = {
  rankList: UserRank[];
};

const cellBase = 'flex items-center justify-center';
const columnClass = {
  rank: `w-[15%] ${cellBase} text-center font-bold`,
  nickname: 'w-[30%] flex flex-wrap gap-x-4 gap-y-1 items-center',
  completion: `w-[20%] ${cellBase} text-center`,
  level: `w-[15%] ${cellBase}`,
  count: `w-[20%] ${cellBase} text-center`,
};

const medals = [medalGold, medalSilver, medalBronze];

const RankingList = ({ rankList }: RankingListProps) => {
  // 임의 데이터
  const username = 'neo348_20';

  return (
    <>
      <div className="mt-4 bg-[#F9EBCE] flex px-1 sm:px-4 py-2.5 sm:py-6 rounded-3xl justify-around items-center text-gray-500 font-bold break-keep whitespace-normal">
        <div className={columnClass.rank}>순위</div>
        <div className={columnClass.nickname}>닉네임</div>
        <div className={columnClass.completion}>도감 완성률</div>
        <div className={columnClass.level}>레벨</div>
        <div className={columnClass.count}>혜택 받은 횟수</div>
      </div>

      <ul className="divide-y-2 divide-dashed divide-[#C3B69C]">
        {rankList.map((user, index) => (
          <li
            key={index}
            className={`flex sm:px-4 py-3.5 sm:py-4 justify-around items-center ${
              user.nickname === username
                ? 'sticky bottom-4 bg-[#BBE3E6] rounded-2xl'
                : ''
            }`}
          >
            <div className={columnClass.rank}>
              {index < 3 ? (
                <img src={medals[index]} alt="메달" className="mx-auto" />
              ) : (
                <span className="text-xl">{user.rank}</span>
              )}
            </div>
            <div className={columnClass.nickname}>
              <span className="font-bold truncate overflow-hidden whitespace-nowrap">
                {user.nickname}
              </span>
              <span className="bg-red-300 px-2 py-1 rounded-2xl text-center w-fit whitespace-nowrap">
                {user.title}
              </span>
            </div>
            <div className={columnClass.completion}>{user.completion}</div>
            <div className={columnClass.level}>Lv. {user.level}</div>
            <div className={columnClass.count}>{user.benefitCount}회</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RankingList;
