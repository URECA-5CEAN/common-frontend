import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useEffect, useRef, useState } from 'react';
import Banner from '@/domains/MyPage/components/Banner';
import { ProgressBar } from '@/domains/MyPage/components/ProgressBar';
import dolphinBeach from '@/assets/image/dolphin-beach.svg';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { getUserInfo, getUserStat } from '@/domains/MyPage/api/profile';
import gifticonLv10 from '@/assets/image/gifticon/gifticon_level10.png';
import gifticonLv20 from '@/assets/image/gifticon/gifticon_level20.png';
import gifticonLv30 from '@/assets/image/gifticon/gifticon_level30.png';
import gifticonLv40 from '@/assets/image/gifticon/gifticon_level40.png';
import gifticonLv50 from '@/assets/image/gifticon/gifticon_level50.png';
import { useAuthStore } from '@/store/useAuthStore';
import { Grid } from 'ldrs/react';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LevelButtonProps {
  level: number;
  active: boolean;
  onClick?: () => void;
}

const LevelButton = ({ level, active, onClick }: LevelButtonProps) => {
  return (
    <div
      className={`relative w-fit z-1 ${active ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={onClick}
    >
      <div
        className={`w-30 h-20 rounded-full absolute top-2 ${active ? 'bg-primaryGreen-80' : 'bg-gray-300'}`}
      ></div>
      <div
        className={`w-30 h-20 select-none translate-y-0 rounded-full flex justify-center items-center font-bold text-xl ${active ? 'active:translate-y-2 transition-all duration-100 bg-primaryGreen text-white' : 'bg-gray-200 text-gray-300'} `}
      >
        Lv.{level}
      </div>
    </div>
  );
};

const RewardPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfoApi>({
    address: '',
    email: '',
    gender: '',
    id: '',
    membership: '',
    name: '',
    nickname: '',
    title: '',
    level: 0,
    exp: 0,
    error: false,
  });
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const { isLoggedIn } = useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md 기준
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDesktopEnter = () => {
    if (!isMobile) setIsInfoOpen(true);
  };

  const handleDesktopLeave = () => {
    if (!isMobile) setIsInfoOpen(false);
  };

  const handleMobileClick = () => {
    if (isMobile) setIsInfoOpen((prev) => !prev);
  };

  const infoWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        infoWrapperRef.current &&
        !infoWrapperRef.current.contains(e.target as Node)
      ) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userInfoRes = await getUserInfo();
        const userStatRes = await getUserStat();

        const mergedData = {
          ...userInfoRes.data,
          ...userStatRes.data,
        };

        setUserInfo(mergedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn]);

  const gifticonMap: Record<number, string> = {
    10: gifticonLv10,
    20: gifticonLv20,
    30: gifticonLv30,
    40: gifticonLv40,
    50: gifticonLv50,
  };
  const imageUrl = gifticonMap[selectedLevel];
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'gifticon.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function getExpByLevel(level: number): number {
    if (!isLoggedIn) return 0;
    if (level >= 50) return 520;
    if (level >= 40) return 400;
    if (level >= 30) return 240;
    if (level >= 20) return 120;
    return 0; // level < 20
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeight(getExpByLevel(userInfo.level));
    });

    return () => clearTimeout(timer);
  }, [userInfo]);

  return (
    <>
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
        <Breadcrumb title="혜택 탐험" subtitle="기프티콘" />
        <div className="text-[32px] mt-3 mb-2 font-bold flex items-center">
          <span className="flex items-center">기프티콘</span>
          <div className="relative" ref={infoWrapperRef}>
            <div
              className="p-3 cursor-pointer md:cursor-default"
              onMouseEnter={handleDesktopEnter}
              onMouseLeave={handleDesktopLeave}
              onClick={handleMobileClick}
            >
              <Info />
            </div>
            {isInfoOpen && (
              <div
                onMouseEnter={handleDesktopEnter}
                onMouseLeave={handleDesktopLeave}
                // onClick={handleMobileClick}
                className="border border-gray-200 font-medium text-base md:shadow-xl p-4 absolute top-10 md:top-6 -left-26 md:left-6 z-3 rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-xl	md:rounded-tl-0 bg-gray-100 w-[260px] flex flex-col gap-2"
              >
                <div className="absolute -top-4 left-[117px] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-gray-100"></div>

                <span className="font-semibold">레벨을 올리려면?</span>
                <div className="">
                  -{' '}
                  <span
                    className="font-semibold cursor-pointer"
                    onClick={() => {
                      navigate('/map?autoClick=true');
                    }}
                  >
                    지도 페이지 → 혜택 인증
                  </span>{' '}
                  탭에서 인증하기
                  <br />-{' '}
                  <span
                    className="font-semibold cursor-pointer"
                    onClick={() => {
                      if (!isLoggedIn) {
                        setIsModalOpen(true);
                      } else {
                        navigate('/mypage/missions');
                      }
                    }}
                  >
                    마이 페이지 → 미션
                  </span>{' '}
                  탭에서 미션 완료하기
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:justify-between">
          <div className="flex gap-4 w-full justify-center bg-[#ffe1be] p-10 rounded-xl relative">
            {loading ? (
              <div className="flex flex-col justify-center items-center gap-4 h-[680px]">
                <Grid size="100" speed="1.5" color="#6fc3d1" />
                정보를 불러오고 있어요
              </div>
            ) : (
              <>
                <div className="w-fit flex flex-col gap-12 relative">
                  <LevelButton
                    level={10}
                    active={!!userInfo && isLoggedIn && userInfo.level >= 10}
                    onClick={() => {
                      if ((userInfo?.level ?? 0) >= 10 && isLoggedIn) {
                        setIsOpen(true);
                        setSelectedLevel(10);
                      }
                    }}
                  />
                  <LevelButton
                    level={20}
                    active={!!userInfo && isLoggedIn && userInfo.level >= 20}
                    onClick={() => {
                      if ((userInfo?.level ?? 0) >= 20 && isLoggedIn) {
                        setIsOpen(true);
                        setSelectedLevel(20);
                      }
                    }}
                  />
                  <LevelButton
                    level={30}
                    active={!!userInfo && isLoggedIn && userInfo.level >= 30}
                    onClick={() => {
                      if ((userInfo?.level ?? 0) >= 30 && isLoggedIn) {
                        setIsOpen(true);
                        setSelectedLevel(30);
                      }
                    }}
                  />
                  <LevelButton
                    level={40}
                    active={!!userInfo && isLoggedIn && userInfo.level >= 40}
                    onClick={() => {
                      if ((userInfo?.level ?? 0) >= 40 && isLoggedIn) {
                        setIsOpen(true);
                        setSelectedLevel(40);
                      }
                    }}
                  />
                  <LevelButton
                    level={50}
                    active={!!userInfo && isLoggedIn && userInfo.level >= 50}
                    onClick={() => {
                      if ((userInfo?.level ?? 0) >= 50 && isLoggedIn) {
                        setIsOpen(true);
                        setSelectedLevel(50);
                      }
                    }}
                  />
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 w-5 h-140 bg-gray-200" />
                  {userInfo && (
                    <div
                      className="absolute top-5 left-1/2 -translate-x-1/2 w-5 bg-primaryGreen-60 transition-all duration-1000 ease-in-out"
                      style={{
                        height: `${height}px`,
                      }}
                    />
                  )}
                </div>
                <div className="w-fit flex flex-col gap-12 mt-2">
                  <div
                    className={`h-20 flex items-center rounded-xl p-3 font-bold justify-center break-keep text-center ${
                      (userInfo?.level ?? 0) >= 10 && isLoggedIn
                        ? 'text-primaryGreen-40 bg-primaryGreen-80'
                        : 'text-gray-300 bg-gray-200'
                    }`}
                  >
                    GS25 1,000원권
                  </div>
                  <div
                    className={`h-20 flex items-center rounded-xl p-3 font-bold justify-center break-keep text-center ${
                      (userInfo?.level ?? 0) >= 20 && isLoggedIn
                        ? 'text-primaryGreen-40 bg-primaryGreen-80'
                        : 'text-gray-300 bg-gray-200'
                    }`}
                  >
                    할리스커피 2,500원권
                  </div>
                  <div
                    className={`h-20 flex items-center rounded-xl p-3 font-bold justify-center break-keep text-center ${
                      (userInfo?.level ?? 0) >= 30 && isLoggedIn
                        ? 'text-primaryGreen-40 bg-primaryGreen-80'
                        : 'text-gray-300 bg-gray-200'
                    }`}
                  >
                    파리바게트 5,000원권
                  </div>
                  <div
                    className={`h-20 flex items-center rounded-xl p-3 font-bold justify-center break-keep text-center ${
                      (userInfo?.level ?? 0) >= 40 && isLoggedIn
                        ? 'text-primaryGreen-40 bg-primaryGreen-80'
                        : 'text-gray-300 bg-gray-200'
                    }`}
                  >
                    CGV 10,000원권
                  </div>
                  <div
                    className={`h-20 flex items-center rounded-xl p-3 font-bold justify-center break-keep text-center ${
                      (userInfo?.level ?? 0) >= 50 && isLoggedIn
                        ? 'text-primaryGreen-40 bg-primaryGreen-80'
                        : 'text-gray-300 bg-gray-200'
                    }`}
                  >
                    VIPS 20,000원권
                  </div>
                </div>
                <img
                  src={dolphinBeach}
                  alt="돌고래"
                  className="absolute top-40 right-[3%] w-30 hidden xl:block"
                />
              </>
            )}
          </div>
          <div className="w-full lg:w-70 flex flex-col gap-4">
            {userInfo && isLoggedIn ? (
              <div className="flex flex-col h-fit justify-between p-3 gap-1 text-gray-700 bg-gray-200 rounded-xl">
                <p className="font-bold text-xl">
                  {userInfo?.nickname}{' '}
                  <span className="text-sm">Lv.{userInfo?.level}</span>
                </p>
                <div>
                  <ProgressBar current={userInfo.exp} max={50} />
                </div>
              </div>
            ) : (
              <div className="break-keep flex flex-col h-fit justify-between p-3 gap-1 text-gray-700 bg-gray-200 rounded-xl">
                로그인 후, 혜택 인증과 미션 참여로 레벨업할 수 있어요. 지금
                로그인하고 더 많은 혜택을 만나보세요!
              </div>
            )}
            <Banner />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="보상받기"
        description={`${selectedLevel}레벨 달성을 축하드려요! 기프티콘 보상도 함께 드릴게요!`}
        actions={
          <>
            <Button
              onClick={() => setIsOpen(false)}
              variant="secondary"
              fullWidth
            >
              닫기
            </Button>
            <Button onClick={handleDownload} fullWidth>
              저장하기
            </Button>
          </>
        }
      >
        <div className="w-full flex justify-center">
          {selectedLevel === 10 && (
            <img src={gifticonLv10} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 20 && (
            <img src={gifticonLv20} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 30 && (
            <img src={gifticonLv30} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 40 && (
            <img src={gifticonLv40} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 50 && (
            <img src={gifticonLv50} alt="기프티콘" className="w-60" />
          )}
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="로그인이 필요해요"
        description="미션을 확인하려면 로그인이 필요해요. 로그인 하시겠어요?"
        actions={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              닫기
            </Button>
            <Button
              fullWidth
              onClick={() => {
                setIsModalOpen(false);
                navigate('/login?redirect=/mypage/missions');
              }}
            >
              로그인 하기
            </Button>
          </>
        }
      />
    </>
  );
};

export default RewardPage;
