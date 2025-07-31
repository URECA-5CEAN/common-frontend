import rankingPodium from '@/assets/image/ranking-podium.png';

const ExploreSection = () => {
  return (
    <div className="absolute top-[230vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center relative">
        {/* 메인 카드 */}
        <div className="bg-[#FFBC52] rounded-2xl p-16 max-w-3xl w-full shadow-2xl min-h-[400px] flex flex-col justify-center mt-32 relative">
          <div className="absolute -top-42 left-1/2 transform -translate-x-1/2 z-10">
            <img src={rankingPodium} className="w-auto h-48 object-contain" />
          </div>
          <h2 className="text-[40px] text-white font-bold mb-10 leading-tight">
            멤버십 혜택 탐험을 떠나요
          </h2>
          <p className="text-2xl text-white font-medium mb-8">
            멤버십 혜택 활용 순위를 확인해보세요
          </p>
          <p className="text-2xl text-white font-medium leading-relaxed">
            혜택을 나누고 싶은 사람을 찾고
            <br />
            채팅을 통해 소통할 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
