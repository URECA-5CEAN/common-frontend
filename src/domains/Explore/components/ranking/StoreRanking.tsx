import { useEffect, useState } from 'react';
import { getStoreRank } from '@/domains/Explore/api/rank';
import StoreRankingList from './StoreRankingList';
import type { StoreRank } from '@/domains/Explore/types/rank';
import TopRankSection from './StoreTopRank';

const UserStoreRanking = () => {
  const [storeRankList, setStoreRankList] = useState<StoreRank[]>([]);

  useEffect(() => {
    const fetchStoreRank = async () => {
      const storeRank = await getStoreRank();
      setStoreRankList(storeRank);
    };
    fetchStoreRank();
  }, []);

  if (!storeRankList || storeRankList.length === 0) {
    return (
      <div className="text-center text-gray-400">
        아직 랭킹 정보가 없습니다 💤
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
