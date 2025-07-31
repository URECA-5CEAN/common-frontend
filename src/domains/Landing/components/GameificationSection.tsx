import orangeFish from '@/assets/icons/orange-fish.svg';
import attendIcon from '@/assets/icons/attend-icon.svg';
import bookIcon from '@/assets/icons/book-icon.svg';
import missionIcon from '@/assets/icons/mission-icon.svg';
import titleIcon from '@/assets/icons/title-icon.svg';
import statsIcon from '@/assets/icons/stats-icon.svg';

const GameificationSection = () => {
  return (
    <div className="absolute top-[320vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-16">
          <img
            src={orangeFish}
            className="w-12 h-12 mr-3"
            alt="물고기 아이콘"
          />
          <h2 className="text-[40px] text-white font-bold">
            게임처럼
            <br /> 재미있게 이용해 보세요!
          </h2>
        </div>

        <div className="flex flex-col items-center gap-8 max-w-6xl w-full">
          <div className="flex justify-center gap-6 w-full">
            {/* 출석 체크 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-8 flex-shrink-0"
              style={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                width: '320px',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <img src={attendIcon} className="w-20 h-20" alt="출석" />
              </div>
              <h3 className="text-[24px] font-bold text-gray-800 mb-4">
                출석 체크
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                매일 출석 체크하면서
                <br />
                경험치를 획득해보세요
              </p>
            </div>

            {/* 칭호 설정 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-8 flex-shrink-0"
              style={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                width: '320px',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <img src={titleIcon} className="w-20 h-20" alt="칭호" />
              </div>
              <h3 className="text-[24px] font-bold text-gray-800 mb-4">
                칭호 설정
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                자랑하고 싶은 칭호를 골라서
                <br />
                보여줄 수 있어요
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-6 w-full">
            {/* 미션 시스템 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-8"
              style={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                width: '320px',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <img src={missionIcon} className="w-20 h-20" alt="미션" />
              </div>
              <h3 className="text-[24px] font-bold text-gray-800 mb-4">
                미션 시스템
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                미션을 도전하면서
                <br />
                레벨업 해보세요
              </p>
            </div>

            {/* 통계 확인 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-8"
              style={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                width: '320px',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <img src={statsIcon} className="w-20 h-20" alt="통계" />
              </div>
              <h3 className="text-[24px] font-bold text-gray-800 mb-4">
                통계 확인
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                나의 사용 패턴을
                <br />
                통계 데이터로 확인해보세요
              </p>
            </div>

            {/* 혜택 도감 카드 */}
            <div
              className="bg-primaryGreen-40 rounded-2xl p-8"
              style={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                width: '320px',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                <img src={bookIcon} className="w-20 h-20" alt="혜택 도감" />
              </div>
              <h3 className="text-[24px] font-bold text-gray-800 mb-4">
                혜택 도감
              </h3>
              <p className="text-[16px] text-gray-600 leading-relaxed">
                멤버십 혜택을 받으면서
                <br />
                도감을 채워보세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameificationSection;
