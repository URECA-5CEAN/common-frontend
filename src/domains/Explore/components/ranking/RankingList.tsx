import type { UserRank } from '@/domains/Explore/components/ranking/UserTotalRanking';
import medalGold from '@/assets/icons/medal_gold.png';
import medalSilver from '@/assets/icons/medal_silver.png';
import medalBronze from '@/assets/icons/medal_bronze.png';
import { useEffect, useState, useRef } from 'react';
import { getUserInfo } from '@/domains/MyPage/api/profile';

type RankingListProps = {
  rankList: UserRank[];
};

const cellBaseClass = 'flex items-center justify-center';
const columnClass = {
  rank: `w-[15%] ${cellBaseClass} text-center font-bold`,
  nickname: 'w-[30%] flex flex-wrap gap-x-4 gap-y-1 items-center',
  completion: `w-[20%] ${cellBaseClass} text-center`,
  level: `w-[15%] ${cellBaseClass}`,
  count: `w-[20%] ${cellBaseClass} text-center`,
};

const medals = [medalGold, medalSilver, medalBronze];

const RankingList = ({ rankList }: RankingListProps) => {
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const [isPassedMyRank, setIsPassedMyRank] = useState(true);
  const myRankRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMyNickname(null);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getUserInfo();
        setMyNickname(res.data.nickname);
      } catch (err) {
        console.error('사용자 정보 가져오기 실패', err);
        setMyNickname(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!myRankRef.current) {
      return;
    }

    const handleScroll = () => {
      if (!myRankRef.current) return;

      const rect = myRankRef.current.getBoundingClientRect();
      setIsPassedMyRank(rect.bottom < 100);
    };
    window.addEventListener('scroll', handleScroll);
    // 초기 상태 체크
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [myNickname]);

  const myRank = rankList.find((user) => user.nickname === myNickname);

  return (
    <>
      <div className="mt-4 bg-[#F9EBCE] flex px-1 sm:px-4 py-2.5 sm:py-6 rounded-3xl justify-around items-center text-gray-500 font-bold break-keep whitespace-normal">
        <div className={columnClass.rank}>순위</div>
        <div className={columnClass.nickname}>닉네임</div>
        <div className={columnClass.completion}>도감 완성률</div>
        <div className={columnClass.level}>레벨</div>
        <div className={columnClass.count}>혜택 받은 횟수</div>
      </div>

      {myRank && isPassedMyRank && (
        <div
          className="sticky top-14 bg-[#BBE3E6] rounded-2xl flex sm:px-4 py-3.5 sm:py-4 justify-around items-center z-10" // Add z-10 to ensure it's above other items
        >
          <div className={columnClass.rank}>
            {rankList.indexOf(myRank) < 3 ? (
              <img
                src={medals[rankList.indexOf(myRank)]}
                alt="메달"
                className="mx-auto"
              />
            ) : (
              <span className="text-xl">{rankList.indexOf(myRank) + 1}</span>
            )}
          </div>
          <div className={columnClass.nickname}>
            <span className="font-bold truncate overflow-hidden whitespace-nowrap">
              {myRank.nickname}
            </span>
            {myRank.title && (
              <span className="bg-red-300 px-2 py-1 rounded-2xl text-center w-fit whitespace-nowrap">
                {myRank.title}
              </span>
            )}
          </div>
          <div className={columnClass.completion}>
            {Number(myRank.completePercentage).toFixed(2).replace(/\.00$/, '')}%
          </div>
          <div className={columnClass.level}>Lv. {myRank.level}</div>
          <div className={columnClass.count}>{myRank.storeUsage}회</div>
        </div>
      )}

      <ul className="">
        {rankList.map((user, index) => (
          <li
            key={index}
            ref={user.nickname === myNickname ? myRankRef : null}
            className={`flex sm:px-4 py-3.5 sm:py-4 justify-around items-center ${
              user.nickname === myNickname && !isPassedMyRank
                ? 'sticky bottom-4 bg-[#BBE3E6] rounded-2xl'
                : ''
            }`}
          >
            <div className={columnClass.rank}>
              {index < 3 ? (
                <img src={medals[index]} alt="메달" className="mx-auto" />
              ) : (
                <span className="text-xl">{index + 1}</span>
              )}
            </div>
            <div className={columnClass.nickname}>
              <span className="font-bold truncate overflow-hidden whitespace-nowrap">
                {user.nickname}
              </span>
              {user.title && (
                <span className="bg-red-300 px-2 py-1 rounded-2xl text-center w-fit whitespace-nowrap">
                  {user.title}
                </span>
              )}
            </div>
            <div className={columnClass.completion}>
              <div className={columnClass.completion}>
                {Number(user.completePercentage)
                  .toFixed(2)
                  .replace(/\.00$/, '')}
                %
              </div>
            </div>
            <div className={columnClass.level}>Lv. {user.level}</div>
            <div className={columnClass.count}>{user.storeUsage}회</div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RankingList;
