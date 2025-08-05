import podiumImage from '@/assets/image/ranking-podium.png';

type PodiumProps = {
  podiumRanks: string[];
};

const RankingPodium = ({ podiumRanks }: PodiumProps) => {
  const [first, second, third] = podiumRanks;

  return (
    <div className="w-full text-gray-800 pt-8 md:pt-14 md:pb-6 bg-white rounded-lg shadow-inner">
      <div
        className="relative w-full max-w-md mx-auto aspect-[472/312] bg-no-repeat bg-contain bg-center"
        style={{ backgroundImage: `url(${podiumImage})` }}
      >
        {first && (
          <div className="absolute -top-[9%] left-1/2 -translate-x-1/2 font-bold truncate overflow-hidden whitespace-nowrap max-w-32 text-center text-sm md:text-base">
            {first}
          </div>
        )}
        {second && (
          <div className="absolute top-[11%] left-[16%] -translate-x-1/2 font-bold truncate overflow-hidden whitespace-nowrap max-w-32 text-center text-sm md:text-base">
            {second}
          </div>
        )}
        {third && (
          <div className="absolute top-[14%] right-[16%] translate-x-1/2 font-bold truncate overflow-hidden whitespace-nowrap max-w-32 text-center text-sm md:text-base">
            {third}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPodium;
