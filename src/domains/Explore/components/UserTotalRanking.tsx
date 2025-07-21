import RankingList from './RankingList';
import RankingPodium from './RankingPodium';

export type UserRank = {
  rank: number;
  nickname: string;
  title: string;
  completion: string;
  level: number;
  benefitCount: number;
};

// 임의 데이터
const rankList: UserRank[] = [
  {
    rank: 1,
    nickname: 'korea154_1',
    title: '절약 고수',
    completion: '56%',
    level: 40,
    benefitCount: 585,
  },
  {
    rank: 2,
    nickname: 'happy140_2',
    title: '신입 유저',
    completion: '99%',
    level: 90,
    benefitCount: 607,
  },
  {
    rank: 3,
    nickname: 'mint367_3',
    title: '미션 전문가',
    completion: '44%',
    level: 6,
    benefitCount: 972,
  },
  {
    rank: 4,
    nickname: 'delta951_4',
    title: '알뜰러',
    completion: '41%',
    level: 2,
    benefitCount: 997,
  },
  {
    rank: 5,
    nickname: 'neo170_5',
    title: '모범 유저',
    completion: '78%',
    level: 99,
    benefitCount: 914,
  },
  {
    rank: 6,
    nickname: 'mint374_6',
    title: '기록형 유저',
    completion: '46%',
    level: 63,
    benefitCount: 557,
  },
  {
    rank: 7,
    nickname: 'alpha207_7',
    title: '혜택 헌터',
    completion: '95%',
    level: 34,
    benefitCount: 123,
  },
  {
    rank: 8,
    nickname: 'korea944_8',
    title: '랭킹 챌린저',
    completion: '79%',
    level: 14,
    benefitCount: 273,
  },
  {
    rank: 9,
    nickname: 'light611_9',
    title: '기록형 유저',
    completion: '60%',
    level: 28,
    benefitCount: 733,
  },
  {
    rank: 10,
    nickname: 'saver779_10',
    title: '혜택 헌터',
    completion: '84%',
    level: 28,
    benefitCount: 414,
  },
  {
    rank: 11,
    nickname: 'neo811_11',
    title: '도감 수집러',
    completion: '96%',
    level: 33,
    benefitCount: 346,
  },
  {
    rank: 12,
    nickname: 'saver291_12',
    title: '알뜰러',
    completion: '50%',
    level: 53,
    benefitCount: 564,
  },
  {
    rank: 13,
    nickname: 'delta832_13',
    title: '절약 고수',
    completion: '80%',
    level: 27,
    benefitCount: 355,
  },
  {
    rank: 14,
    nickname: 'alpha465_14',
    title: '기록형 유저',
    completion: '76%',
    level: 64,
    benefitCount: 782,
  },
  {
    rank: 15,
    nickname: 'delta963_15',
    title: '혜택 수집가',
    completion: '77%',
    level: 25,
    benefitCount: 165,
  },
  {
    rank: 16,
    nickname: 'light243_16',
    title: '모범 유저',
    completion: '53%',
    level: 8,
    benefitCount: 290,
  },
  {
    rank: 17,
    nickname: 'korea800_17',
    title: '혜택 수집가',
    completion: '83%',
    level: 26,
    benefitCount: 834,
  },
  {
    rank: 18,
    nickname: 'delta250_18',
    title: '베테랑',
    completion: '45%',
    level: 33,
    benefitCount: 572,
  },
  {
    rank: 19,
    nickname: 'user295_19',
    title: '절약 고수',
    completion: '69%',
    level: 30,
    benefitCount: 908,
  },
  {
    rank: 20,
    nickname: 'neo348_20',
    title: '혜택 헌터',
    completion: '74%',
    level: 9,
    benefitCount: 189,
  },
  {
    rank: 21,
    nickname: 'korea872_21',
    title: '탐험가',
    completion: '48%',
    level: 36,
    benefitCount: 822,
  },
  {
    rank: 22,
    nickname: 'korea103_22',
    title: '신의 한수',
    completion: '41%',
    level: 94,
    benefitCount: 277,
  },
  {
    rank: 23,
    nickname: 'light182_23',
    title: '혜택 수집가',
    completion: '50%',
    level: 19,
    benefitCount: 321,
  },
  {
    rank: 24,
    nickname: 'alpha280_24',
    title: '미션 전문가',
    completion: '56%',
    level: 24,
    benefitCount: 678,
  },
  {
    rank: 25,
    nickname: 'mint676_25',
    title: '절약 고수',
    completion: '89%',
    level: 93,
    benefitCount: 935,
  },
];

const UserTotalRanking = () => {
  if (!rankList || rankList.length === 0) {
    return (
      <div className="text-center text-gray-400">
        아직 랭킹 정보가 없습니다 💤
      </div>
    );
  }

  const podiumRanks = rankList
    .filter((user) => user.rank >= 1 && user.rank <= 3)
    .sort((a, b) => a.rank - b.rank)
    .map((user) => user.nickname);

  return (
    <>
      <RankingPodium podiumRanks={podiumRanks} />
      <RankingList rankList={rankList} />
    </>
  );
};

export default UserTotalRanking;
