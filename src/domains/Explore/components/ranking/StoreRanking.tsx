import { useEffect, useState } from 'react';
import { getStoreRank } from '@/domains/Explore/api/rank';
import StoreRankingList from './StoreRankingList';
import type { StoreRank } from '@/domains/Explore/types/rank';
import TopRankSection from './StoreTopRank';
import { Grid } from 'ldrs/react';

const UserStoreRanking = () => {
  const [storeRankList, setStoreRankList] = useState<StoreRank[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStoreRank = async () => {
      try {
        const storeRank = await getStoreRank();
        setStoreRankList(storeRank);
      } catch (e) {
        console.error('매장 순위 로딩 실패', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreRank();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-100 flex flex-col justify-center items-center gap-4 text-gray-600">
        <Grid size="100" speed="1.5" color="#6fc3d1" />
        순위 데이터를 불러오고 있어요
      </div>
    );
  }

  if (!storeRankList || storeRankList.length === 0) {
    return (
      <div className="text-center text-gray-400">
        아직 순위 정보가 없습니다 💤
      </div>
    );
  }
  return (
    <>
      <TopRankSection topStores={storeRankList.slice(0, 3)} />
      <StoreRankingList rankList={storeRankList} />
    </>
  );
};

export default UserStoreRanking;
