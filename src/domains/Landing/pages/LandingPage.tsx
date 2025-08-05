import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { ArrowUpToLine } from 'lucide-react';
import MotionPathAnimation from '@/domains/Landing/pages/MotionPathAnimation';
import beach from '@/assets/image/beach.png';
import wave from '@/assets/image/LandingWave.svg';
import HeroSection from '@/domains/Landing/components/HeroSection';
import MapSection from '@/domains/Landing/components/MapSection';
import ExploreSection from '@/domains/Landing/components/ExploreSection';
import GameificationSection from '@/domains/Landing/components/GameificationSection';
import StoreSection from '@/domains/Landing/components/StoreSection';
import NavigationSection from '@/domains/Landing/components/NavigationSection';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [showTopButton, setShowTopButton] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMapClick = () => {
    navigate('/map');
  };

  const handleExploreClick = () => {
    navigate('/explore/rankings');
  };

  const handleMyPageClick = () => {
    if (isLoggedIn) {
      navigate('/mypage/profile');
    } else {
      navigate('/login');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="">
      <img
        src={beach}
        alt="모래사장"
        className="absolute top-0 w-full h-[100vh]"
      />

      {/* 모바일 전용 파도 */}
      <div className="absolute top-[120px] h-[50vh] overflow-hidden w-full md:hidden">
        <img
          src={wave}
          alt="파도"
          className="h-full w-full min-w-[1654px] object-cover object-left"
        />
      </div>

      {/* 태블릿/데스크톱 전용 파도 */}
      <div className="absolute top-[130px] h-full overflow-hidden w-full hidden md:block">
        <img src={wave} alt="파도" className="h-full min-w-[1654px]" />
      </div>
      <MotionPathAnimation />

      {/* 첫 번째 섹션 - 메인 타이틀 */}
      <HeroSection />
      <div className="relative z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4DD2EB] to-[#2C6385] -z-10" />
        {/* 두 번째 섹션 - 멤버십 지도 */}
        <MapSection />

        {/* 세 번째 섹션 - 멤버십 혜택 탐험 */}
        <ExploreSection />

        {/* 네 번째 섹션 - 게이미피케이션 섹션 */}
        <GameificationSection />

        {/* 다섯 번째 섹션 - 제휴처 정보 */}
        <StoreSection />

        {/* 여섯 번째 섹션 - 페이지 이동 */}
        <NavigationSection
          onMapClick={handleMapClick}
          onExploreClick={handleExploreClick}
          onMyPageClick={handleMyPageClick}
        />
      </div>
      {/* 탑 버튼 */}
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 md:w-14 md:h-14 bg-primaryGreen-60 hover:bg-primaryGreen-80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="맨 위로 이동"
        >
          <ArrowUpToLine size={16} className="md:hidden" />
          <ArrowUpToLine size={24} className="hidden md:block" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
