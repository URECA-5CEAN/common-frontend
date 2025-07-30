import { useEffect, useState } from 'react';
import UserRankingList from '@/domains/Explore/components/ranking/UserRankingList';
import RankingPodium from '@/domains/Explore/components/ranking/RankingPodium';
import { getUserRank } from '@/domains/Explore/api/rank';
import type { UserRank } from '@/domains/Explore/types/rank';

const UserTotalRanking = () => {
  const [rankList, setRankList] = useState<UserRank[]>([]);

  useEffect(() => {
    const fetchUserRank = async () => {
      const userRank = await getUserRank();
      setRankList(userRank);
    };
    fetchUserRank();
  }, []);

  if (!rankList || rankList.length === 0) {
    return (
      <div className="text-center text-gray-400">
        아직 랭킹 정보가 없습니다 💤
      </div>
    );
  }

  const podiumRanks = rankList
    .filter((_, i) => i + 1 >= 1 && i + 1 <= 3)
    .sort((a, b) => a.rank - b.rank)
    .map((user) => user.nickname);

  return (
    <>
      <RankingPodium podiumRanks={podiumRanks} />
      <UserRankingList rankList={rankList} />
    </>
  );
};

export default UserTotalRanking;
