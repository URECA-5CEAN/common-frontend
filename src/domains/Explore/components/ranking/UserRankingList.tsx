import type { UserRank } from '@/domains/Explore/types/rank';
import medalGold from '@/assets/icons/medal_gold.png';
import medalSilver from '@/assets/icons/medal_silver.png';
import medalBronze from '@/assets/icons/medal_bronze.png';
import { useEffect, useState, useRef } from 'react';
import { getUserInfo } from '@/domains/MyPage/api/profile';

type RankingListProps = {
  rankList: UserRank[];
};

const cellBase = 'flex items-center justify-center';
const columnClass = {
  rank: `flex-[1.5] ${cellBase} text-center font-bold`,
  nickname: 'flex-[3] flex flex-wrap gap-x-4 gap-y-1 items-center',
  completion: `flex-[2] ${cellBase} text-center`,
  level: `flex-[1.5] ${cellBase}`,
  count: `flex-[2] ${cellBase} text-center`,
};

const tagClass =
  'shimmer text-[10px] sm:text-base px-2 py-1.5 rounded-xl w-fit text-[#282ab3] transition-all duration-300 whitespace-nowrap max-w-[6rem] sm:max-w-[11rem] overflow-hidden text-ellipsis';

const medals = [medalGold, medalSilver, medalBronze];

const RankRow = ({
  user,
  index,
  isSticky,
  isTopSticky,
  refProp,
}: {
  user: UserRank;
  index: number;
  isSticky?: boolean;
  isTopSticky?: boolean;
  refProp?: React.RefObject<HTMLLIElement | null>;
}) => {
  const stickyClass = isSticky
    ? `sticky ${isTopSticky ? 'top-15' : 'bottom-4'} bg-[#BBE3E6] rounded-2xl z-10`
    : '';
  return (
    <li
      ref={refProp}
      className={`text-sm sm:text-base flex sm:px-4 py-3.5 sm:py-4 justify-around items-center text-gray-800 ${stickyClass}`}
    >
      <div className={columnClass.rank}>
        {index < 3 ? (
          <img src={medals[index]} alt="메달" className="mx-auto" />
        ) : (
          <span className="text-xl">{index + 1}</span>
        )}
      </div>
      <div className={columnClass.nickname}>
        <span className="font-bold truncate overflow-hidden whitespace-nowrap max-w-[6rem] sm:max-w-[8rem]">
          {user.nickname}
        </span>
        {user.title && <span className={tagClass}>{user.title}</span>}
      </div>
      <div className={columnClass.completion}>
        {Number(user.completePercentage).toFixed(2).replace(/\.00$/, '')}%
      </div>
      <div className={columnClass.level}>Lv. {user.level}</div>
      <div className={columnClass.count}>{user.storeUsage}회</div>
    </li>
  );
};

const UserRankingList = ({ rankList }: RankingListProps) => {
  const [myNickname, setMyNickname] = useState<string | null>(null);
  const [isPassedMyRank, setIsPassedMyRank] = useState(true);
  const [isMyRankVisible, setIsMyRankVisible] = useState(false);
  const myRankRef = useRef<HTMLLIElement>(null);

  const myRank = rankList.find((u) => u.nickname === myNickname);
  const myIndex = rankList.findIndex((u) => u.nickname === myNickname);

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
    if (!myRankRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsMyRankVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(myRankRef.current);
    return () => observer.disconnect();
  }, [myNickname]);

  useEffect(() => {
    if (!myRankRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsMyRankVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );

    observer.observe(myRankRef.current);
    return () => observer.disconnect();
  }, [myNickname]);

  useEffect(() => {
    const handleScroll = () => {
      if (!myRankRef.current) return;

      const rect = myRankRef.current.getBoundingClientRect();
      setIsPassedMyRank(rect.bottom < 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 체크
    return () => window.removeEventListener('scroll', handleScroll);
  }, [myNickname]);

  return (
    <>
      {/* 헤더 */}
      <div className="mt-4 bg-[#F9EBCE] flex px-1 sm:px-4 py-2.5 sm:py-6 rounded-3xl justify-around items-center text-gray-600 font-bold break-keep whitespace-normal">
        <div className={columnClass.rank}>순위</div>
        <div className={columnClass.nickname}>닉네임</div>
        <div className={columnClass.completion}>도감 완성률</div>
        <div className={columnClass.level}>레벨</div>
        <div className={columnClass.count}>혜택 받은 횟수</div>
      </div>

      {/* 위에 고정된 내 순위 */}
      {myRank && isPassedMyRank && (
        <RankRow user={myRank} index={myIndex} isSticky isTopSticky />
      )}

      {/* 전체 랭킹 */}
      <ul className="mt-2 sm:mt-4 bg-white">
        {rankList.map((user, index) => (
          <RankRow
            key={index}
            user={user}
            index={index}
            refProp={user.nickname === myNickname ? myRankRef : undefined}
            isSticky={user.nickname === myNickname && !isPassedMyRank}
          />
        ))}
      </ul>

      {/* 아래 고정된 내 순위 */}
      {myRank && !isMyRankVisible && !isPassedMyRank && (
        <RankRow user={myRank} index={myIndex} isSticky />
      )}
    </>
  );
};

export default UserRankingList;
