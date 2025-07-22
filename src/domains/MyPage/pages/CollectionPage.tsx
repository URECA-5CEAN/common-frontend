import { Breadcrumb } from '@/domains/MyPage/components/Breadcrumb';
import { ProgressBar } from '@/domains/MyPage/components/ProgressBar';
import sampleImage from '@/assets/icons/vvip_icon.png';
import bronzeMedal from '@/assets/image/bronze_medal.png';
import silverMedal from '@/assets/image/silver_medal.png';
import goldMedal from '@/assets/image/gold_medal.png';
import diamondMedal from '@/assets/image/diamond_medal.png';

const CollectionPage = () => {
  // 실제로는 API에서 받아올 데이터
  const collectionInfo = {
    collectionCount: 400,
    totalCollection: 500,
  };
  const allMedals = [bronzeMedal, silverMedal, goldMedal, diamondMedal];

  const collectionInfoList = [
    {
      name: '롯데월드 아쿠아리움',
      image: sampleImage,
      current: 20,
      total: 20,
    },
    {
      name: '에버랜드',
      image: sampleImage,
      current: 5,
      total: 20,
    },
    {
      name: '할리스 커피',
      image: sampleImage,
      current: 2,
      total: 20,
    },
    {
      name: 'CGV',
      image: sampleImage,
      current: 15,
      total: 20,
    },
  ];

  const progressPercentage = (
    (collectionInfo.collectionCount / collectionInfo.totalCollection) *
    100
  ).toFixed(2);

  const getMedalCount = (current: number): number => {
    if (current >= 15) return 4;
    if (current >= 10) return 3;
    if (current >= 5) return 2;
    if (current >= 1) return 1;
    return 0;
  };

  return (
    <>
      <div className="w-full max-w-[1050px]">
        <Breadcrumb title="혜택 도감" />
        <div>
          <div className="text-[32px] font-bold">혜택 도감</div>
          <div className="text-2xl font-bold">도감 완성도</div>
          <div className="z-1 relative bg-gray-300 rounded-2xl h-10 text-xs w-full overflow-hidden mb-1">
            <div
              className="shimmer z-0 absolute top-0 bg-[#96E0ED] h-full rounded-2xl 
                   after:content-[''] after:block after:h-1 after:absolute after:mx-2
                   after:top-2 after:bg-white/30 after:rounded-full after:left-1 after:right-1"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="relative z-1 flex justify-end items-center text-xs text-gray-600">
            {collectionInfo.collectionCount}/{collectionInfo.totalCollection} (
            {progressPercentage}%)
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {collectionInfoList.map((info, index) => {
              const earnedMedalCount = getMedalCount(info.current);
              const medalsToShow = allMedals.slice(0, earnedMedalCount);

              return (
                <div
                  key={index}
                  className="border-1 border-gray-200 rounded-xl p-4 flex md:flex-row flex-col gap-3 w-full items-center justify-around"
                >
                  <div className="max-w-[129px] flex items-center">
                    <img src={info.image} alt={info.name} />
                  </div>
                  <div className="w-full md:w-[100px] flex flex-col gap-2 items-center">
                    <div className="break-words break-keep text-center h-[48px] w-full flex justify-center items-center">
                      {info.name}
                    </div>
                    <div className="flex h-[47px] md:h-[33px] -space-x-[24px] md:-space-x-[12%] w-full md:w-[100px] justify-center md:justify-start">
                      {medalsToShow.map((medal, idx) => (
                        <img
                          key={idx}
                          className="w-[50px] md:w-[35px]"
                          src={medal}
                          alt={`메달-${idx}`}
                        />
                      ))}
                    </div>
                    <div className="w-full">
                      <ProgressBar current={info.current} max={info.total} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionPage;
