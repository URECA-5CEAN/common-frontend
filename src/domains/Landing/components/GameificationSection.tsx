import orangeFish from '@/assets/icons/orange-fish.svg';
import attendIcon from '@/assets/icons/attend-icon.svg';
import bookIcon from '@/assets/icons/book-icon.svg';
import missionIcon from '@/assets/icons/mission-icon.svg';
import titleIcon from '@/assets/icons/title-icon.svg';
import statsIcon from '@/assets/icons/stats-icon.svg';
import FadeInSection from '@/domains/Landing/components/FadeInSection';

const GameificationSection = () => {
  return (
    <FadeInSection className="w-full mt-40 md:mt-50">
      <div className="select-none w-full max-w-[90rem] xl:max-w-[1440px] mx-auto px-[1rem] sm:px-[1.5rem] lg:px-[2rem] flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-8 lg:mb-16">
          <img
            src={orangeFish}
            className="w-[2.5rem] h-[2.5rem] lg:w-12 lg:h-12 mr-[0.75rem] lg:mr-3"
            alt="물고기 아이콘"
          />
          <h2 className="text-2xl md:text-4xl  text-white font-bold leading-tight pr-13 lg:pr-[60px]">
            게임처럼
            <br /> 재미있게 이용해 보세요!
          </h2>
        </div>

        <div className="flex flex-col items-center gap-[1.5rem] md:gap-[2rem] lg:gap-8 max-w-[76rem] xl:max-w-6xl w-full">
          {/* 모바일: 첫 번째 행 - 상단 1개 카드 (출석 체크) */}
          <div className="flex justify-center items-center w-full md:hidden">
            <div
              className="bg-primaryGreen-40 rounded-2xl p-3 flex-shrink-0 w-36 max-w-[45vw]"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <img src={attendIcon} className="w-8 h-8" alt="출석" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                출석 체크
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                매일 출석하며
                <br />
                경험치 획득
              </p>
            </div>
          </div>

          {/* 모바일: 두 번째 행 - 중단 2개 카드 (칭호 설정, 미션 시스템) */}
          <div className="flex justify-center items-center gap-3 w-full md:hidden">
            <div
              className="bg-primaryGreen-40 rounded-2xl p-3 flex-shrink-0 w-36 max-w-[45vw]"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <img src={titleIcon} className="w-8 h-8" alt="칭호" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                칭호 설정
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                자랑하고 싶은
                <br />
                칭호를 설정
              </p>
            </div>

            <div
              className="bg-primaryGreen-40 rounded-2xl p-3 flex-shrink-0 w-36 max-w-[45vw]"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <img src={missionIcon} className="w-8 h-8" alt="미션" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                미션 시스템
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                미션 도전으로
                <br />
                레벨업 하기
              </p>
            </div>
          </div>

          {/* 모바일: 세 번째 행 - 하단 2개 카드 (통계 확인, 혜택 도감) */}
          <div className="flex justify-center items-center gap-3 w-full md:hidden">
            <div
              className="bg-primaryGreen-40 rounded-2xl p-3 flex-shrink-0 w-36 max-w-[45vw]"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <img src={statsIcon} className="w-8 h-8" alt="통계" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                통계 확인
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                나의 사용 패턴
                <br />
                통계로 확인
              </p>
            </div>

            <div
              className="bg-primaryGreen-40 rounded-2xl p-3 flex-shrink-0 w-36 max-w-[45vw]"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-2">
                <img src={bookIcon} className="w-8 h-8" alt="혜택 도감" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">
                혜택 도감
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                멤버십 혜택으로
                <br />
                도감을 채우기
              </p>
            </div>
          </div>

          {/* 태블릿/데스크톱: 첫 번째 행 - 상단 2개 카드 */}
          <div className="hidden md:flex flex-row justify-center items-center gap-[1.5rem] lg:gap-6 w-full">
            {/* 출석 체크 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-4 md:p-[1.25rem] lg:p-8 flex-shrink-0 mx-auto md:mx-2 lg:mx-0 w-48 md:w-64 max-w-[70vw] md:max-w-[320px] hover:scale-105 transition-all duration-500 ease-out"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-[1rem] lg:mb-6">
                <img
                  src={attendIcon}
                  className="w-[3rem] h-[3rem] lg:w-20 lg:h-20"
                  alt="출석"
                />
              </div>
              <h3 className="text-[1.125rem] lg:text-[1.5rem] font-bold text-gray-800 mb-[0.75rem] lg:mb-4">
                출석 체크
              </h3>
              <p className="text-[0.75rem] lg:text-[1rem] text-gray-600 leading-relaxed">
                매일 출석 체크하면서
                <br />
                경험치를 획득해보세요
              </p>
            </div>

            {/* 칭호 설정 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-4 md:p-[1.25rem] lg:p-8 flex-shrink-0 mx-auto md:mx-2 lg:mx-0 w-48 md:w-64 max-w-[70vw] md:max-w-[320px] hover:scale-105 transition-all duration-500 ease-out"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-[1rem] lg:mb-6">
                <img
                  src={titleIcon}
                  className="w-[3rem] h-[3rem] lg:w-20 lg:h-20"
                  alt="칭호"
                />
              </div>
              <h3 className="text-[1.125rem] lg:text-[1.5rem] font-bold text-gray-800 mb-[0.75rem] lg:mb-4">
                칭호 설정
              </h3>
              <p className="text-[0.75rem] lg:text-[1rem] text-gray-600 leading-relaxed">
                자랑하고 싶은 칭호를 골라서
                <br />
                보여줄 수 있어요
              </p>
            </div>
          </div>

          {/* 태블릿/데스크톱: 두 번째 행 - 하단 3개 카드 */}
          <div className="hidden md:flex flex-row justify-center items-center gap-[1.5rem] lg:gap-6 w-full">
            {/* 미션 시스템 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-4 md:p-[1.25rem] lg:p-8 mx-auto md:mx-2 lg:mx-0 w-48 md:w-64 max-w-[70vw] md:max-w-[320px] hover:scale-105 transition-all duration-500 ease-out"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-[1rem] lg:mb-6">
                <img
                  src={missionIcon}
                  className="w-[3rem] h-[3rem] lg:w-20 lg:h-20"
                  alt="미션"
                />
              </div>
              <h3 className="text-[1.125rem] lg:text-[1.5rem] font-bold text-gray-800 mb-[0.75rem] lg:mb-4">
                미션 시스템
              </h3>
              <p className="text-[0.75rem] lg:text-[1rem] text-gray-600 leading-relaxed">
                미션을 도전하면서
                <br />
                레벨업 해보세요
              </p>
            </div>

            {/* 통계 확인 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-4 md:p-[1.25rem] lg:p-8 mx-auto md:mx-2 lg:mx-0 w-48 md:w-64 max-w-[70vw] md:max-w-[320px] hover:scale-105 transition-all duration-500 ease-out"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-[1rem] lg:mb-6">
                <img
                  src={statsIcon}
                  className="w-[3rem] h-[3rem] lg:w-20 lg:h-20"
                  alt="통계"
                />
              </div>
              <h3 className="text-[1.125rem] lg:text-[1.5rem] font-bold text-gray-800 mb-[0.75rem] lg:mb-4">
                통계 확인
              </h3>
              <p className="text-[0.75rem] lg:text-[1rem] text-gray-600 leading-relaxed">
                나의 사용 패턴을
                <br />
                통계 데이터로 확인해보세요
              </p>
            </div>

            {/* 혜택 도감 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-4 md:p-[1.25rem] lg:p-8 mx-auto md:mx-2 lg:mx-0 w-48 md:w-64 max-w-[70vw] md:max-w-[320px] hover:scale-105 transition-all duration-500 ease-out"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              }}
            >
              <div className="flex items-center justify-center mb-[1rem] lg:mb-6">
                <img
                  src={bookIcon}
                  className="w-[3rem] h-[3rem] lg:w-20 lg:h-20"
                  alt="혜택 도감"
                />
              </div>
              <h3 className="text-[1.125rem] lg:text-[1.5rem] font-bold text-gray-800 mb-[0.75rem] lg:mb-4">
                혜택 도감
              </h3>
              <p className="text-[0.75rem] lg:text-[1rem] text-gray-600 leading-relaxed">
                멤버십 혜택을 받으면서
                <br />
                도감을 채워보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default GameificationSection;
