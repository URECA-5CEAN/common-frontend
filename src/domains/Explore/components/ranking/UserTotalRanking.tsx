import { useEffect, useState } from 'react';
import UserRankingList from '@/domains/Explore/components/ranking/UserRankingList';
import RankingPodium from '@/domains/Explore/components/ranking/RankingPodium';
import { getUserRank } from '@/domains/Explore/api/rank';
import type { UserRank } from '@/domains/Explore/types/rank';
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css';

const UserTotalRanking = () => {
  const [rankList, setRankList] = useState<UserRank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserRank = async () => {
      try {
        const userRank = await getUserRank();
        setRankList(userRank);
      } catch (e) {
        console.error('전체 순위 불러오기 실패', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserRank();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-100 flex flex-col justify-center items-center gap-4 text-gray-600">
        <Grid size="100" speed="1.5" color="#6fc3d1" />
        순위 데이터를 불러오고 있어요
      </div>
    );
  }

  if (!rankList || rankList.length === 0) {
    return (
      <div className="text-center text-gray-400">
        아직 순위 정보가 없습니다 💤
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
