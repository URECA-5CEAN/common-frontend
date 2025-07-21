import podiumImage from '@/assets/image/ranking-podium.png';

type PodiumProps = {
  podiumRanks: string[];
};

const RankingPodium = ({ podiumRanks }: PodiumProps) => {
  const [first, second, third] = podiumRanks;

  return (
    <div
      className="relative w-full max-w-md mx-auto aspect-[472/312] bg-no-repeat bg-contain bg-center mt-10"
      style={{ backgroundImage: `url(${podiumImage})` }}
    >
      {first && (
        <div className="absolute -top-[9%] left-1/2 -translate-x-1/2 font-bold truncate overflow-hidden whitespace-nowrap max-w-32 text-center">
          {first}
        </div>
      )}
      {second && (
        <div className="absolute top-[11%] left-[16%] -translate-x-1/2 font-bold truncate overflow-hidden whitespace-nowrap max-w-32 text-center">
          {second}
        </div>
      )}
      {third && (
        <div className="absolute top-[14%] right-[16%] translate-x-1/2 font-bold truncate overflow-hidden whitespace-nowrap max-w-32 text-center">
          {third}
        </div>
      )}
    </div>
  );
};

export default RankingPodium;
