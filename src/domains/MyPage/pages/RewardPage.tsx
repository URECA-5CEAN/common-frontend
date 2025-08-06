import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { useEffect, useRef, useState } from 'react';
import Banner from '@/domains/MyPage/components/Banner';
import { ProgressBar } from '@/domains/MyPage/components/ProgressBar';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { getUserInfo, getUserStat } from '@/domains/MyPage/api/profile';
import { useAuthStore } from '@/store/useAuthStore';
import { Info, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import gs25 from '@/assets/image/gifticon/gs25.png';
import megabox from '@/assets/image/gifticon/megabox.png';
import shakeshack from '@/assets/image/gifticon/shakeshack.png';
import vips from '@/assets/image/gifticon/vips.png';
import baskin from '@/assets/image/gifticon/baskin.png';
import cgv from '@/assets/image/gifticon/cgv.png';
import giftLv1 from '@/assets/image/gifticon/gift_level_1.png';
import giftLv5 from '@/assets/image/gifticon/gift_level_5.png';
import giftLv10 from '@/assets/image/gifticon/gift_level_10.png';
import giftLv15 from '@/assets/image/gifticon/gift_level_15.png';
import giftLv20 from '@/assets/image/gifticon/gift_level_20.png';
import giftLv25 from '@/assets/image/gifticon/gift_level_25.png';
import giftLv30 from '@/assets/image/gifticon/gift_level_30.png';
import giftLv35 from '@/assets/image/gifticon/gift_level_35.png';
import giftLv40 from '@/assets/image/gifticon/gift_level_40.png';
import giftLv45 from '@/assets/image/gifticon/gift_level_45.png';
import giftLv50 from '@/assets/image/gifticon/gift_level_50.png';

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

  const { isLoggedIn } = useAuthStore();

  const infoRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const handleOpenInfo = () => {
    setIsInfoOpen(true);
  };
  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setIsInfoOpen(false);
      }
    };

    if (isInfoOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInfoOpen]);

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
    1: giftLv1,
    5: giftLv5,
    10: giftLv10,
    15: giftLv15,
    20: giftLv20,
    25: giftLv25,
    30: giftLv30,
    35: giftLv35,
    40: giftLv40,
    45: giftLv45,
    50: giftLv50,
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

  const LeftStart = () => {
    return (
      <>
        <div className="absolute left-20 w-[calc(100%-160px)] h-4 bg-primaryGreen-40" />
        <div className="absolute w-40 h-40 right-0 rounded-full bg-primaryGreen-40">
          <div className="absolute w-32 h-32 rounded-full bg-white top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute w-32 h-32 bg-white top-4 right-20"></div>
        </div>
        <div className="absolute left-20 w-[calc(100%-160px)] h-4 bg-primaryGreen-40 top-36" />
      </>
    );
  };
  const RightStart = () => {
    return (
      <>
        <div className="absolute left-20 w-[calc(100%-160px)] h-4 bg-primaryGreen-40" />
        <div className="absolute w-40 h-40 rounded-full bg-primaryGreen-40">
          <div className="absolute w-32 h-32 rounded-full bg-white top-1/2 left-1/2 -translate-1/2" />
          <div className="absolute w-32 h-32 bg-white top-4 left-20"></div>
        </div>
        <div className="absolute left-20 w-[calc(100%-160px)] h-4 bg-primaryGreen-40 top-36" />
      </>
    );
  };

  interface RewardProps {
    level: number;
    brand: string;
    reward: string;
    isDone: boolean;
    onClick?: () => void;
  }
  const Reward = ({ level, brand, reward, isDone, onClick }: RewardProps) => {
    return (
      <div
        onClick={onClick}
        className={`select-none absolute w-18 xl:w-26 h-18 xl:h-26 bg-white rounded-full border-2 z-1 transform-all duration-300 ${isDone ? 'cursor-pointer border-primaryGreen-60 hover:scale-110' : 'border-gray-200'}`}
      >
        <div className={`${isDone ? 'floating' : ''}`}>
          <span
            className={`absolute -top-10 xl:-top-8 text-sm xl:text-base left-1/2 -translate-x-1/2 z-1 p-2 rounded-xl font-bold whitespace-nowrap ${isDone ? 'bg-primaryGreen text-white' : 'bg-gray-200 text-gray-300'} `}
          >
            Lv.{level} 달성
          </span>
          <div
            className={`w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-12 border-b-0 absolute left-1/2 -top-1 xl:top-1 -translate-x-1/2 ${isDone ? 'border-primaryGreen' : 'border-gray-200'}`}
          />
        </div>

        <img
          src={brand}
          alt={brand}
          className={`w-10 xl:w-15 absolute top-4 xl:top-6 left-1/2 -translate-x-1/2 rounded-xl ${isDone ? 'opacity-100' : 'opacity-30'}`}
        />
        <span
          className={`whitespace-nowrap absolute text-sm xl:text-base top-10 xl:top-15 left-1/2 -translate-x-1/2 font-bold ${isDone ? 'text-[#2ba9cf]' : 'text-gray-300'}`}
        >
          {reward}
        </span>
      </div>
    );
  };

  return (
    <>
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
        <Breadcrumb title="혜택 탐험" subtitle="기프티콘" />
        <div className="text-[32px] mt-3 mb-2 font-bold flex items-center">
          <span className="flex items-center">기프티콘</span>
          <div className="relative">
            <div
              className="cursor-pointer flex justify-end pl-2 items-center gap-0.5"
              onClick={handleOpenInfo}
            >
              <Info color="#808080" size={18} />
              <span className="text-sm text-[#808080]">레벨업 하려면?</span>
            </div>
            {isInfoOpen && (
              <div
                ref={infoRef}
                className="text-[#6e6e6e] select-none border border-gray-500 font-medium text-base md:shadow-xl p-4 absolute top-0 left-1/2 -translate-x-1/2 z-3 rounded-xl bg-white w-[220%] sm:w-[320px] flex flex-col gap-2 cursor-auto"
              >
                <div className="flex justify-between">
                  <span className="">레벨업 하려면?</span>
                  <X
                    color="#717379"
                    className="cursor-pointer"
                    onClick={() => {
                      handleCloseInfo();
                    }}
                  />
                </div>
                <div className="">
                  -{' '}
                  <span
                    className="font-semibold cursor-pointer text-primaryGreen-80"
                    onClick={() => {
                      navigate('/map?autoClick=true');
                    }}
                  >
                    지도 페이지 → 혜택 인증
                  </span>{' '}
                  탭에서 인증하기!
                  <br />-{' '}
                  <span
                    className="font-semibold cursor-pointer text-primaryGreen-80"
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
                  탭에서 미션 완료하기!
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:justify-between">
          <div className="flex gap-4 w-full h-[880px] pt-36 justify-center border border-gray-200 px-10 rounded-xl relative">
            <div className="absolute w-full h-20 bg-white">
              {/*  */}
              <div className="relative flex justify-center items-center w-[calc(100%-96px)] pl-24 h-200">
                {/*  */}
                <div className="absolute w-full h-fit top-0">
                  <LeftStart />

                  {/* 1렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-7 xl:-top-12 -left-6">
                    <Reward
                      level={1}
                      brand={gs25}
                      reward="백원"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 1}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 1 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(1);
                        }
                      }}
                    />
                    <div className="absolute top-7 xl:top-12 -right-4 bg-primaryGreen-40 h-4 w-10"></div>
                  </div>

                  {/* 5렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-7 xl:-top-12 left-[40%]">
                    <Reward
                      level={5}
                      brand={gs25}
                      reward="삼천원"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 5}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 5 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(5);
                        }
                      }}
                    />
                  </div>

                  {/* 10렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-4 sm:-top-6 md:-top-4 xl:-top-10 left-[75%] sm:left-[80%]">
                    <Reward
                      level={10}
                      brand={baskin}
                      reward="싱글킹"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 10}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 10 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(10);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="absolute w-full h-fit top-36">
                  <RightStart />

                  {/* 15렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-7 xl:-top-12 left-[60%]">
                    <Reward
                      level={15}
                      brand={shakeshack}
                      reward="쉑버거"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 15}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 15 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(15);
                        }
                      }}
                    />
                  </div>

                  {/* 20렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-1 xl:-top-8 -left-0">
                    <Reward
                      level={20}
                      brand={baskin}
                      reward="파인트"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 20}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 20 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(20);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="absolute w-full h-fit top-72">
                  <LeftStart />

                  {/* 25렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-7 xl:-top-12 left-[25%]">
                    <Reward
                      level={25}
                      brand={gs25}
                      reward="만원"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 25}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 25 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(25);
                        }
                      }}
                    />
                  </div>

                  {/* 30렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-7 xl:-top-12 left-[70%]">
                    <Reward
                      level={30}
                      brand={megabox}
                      reward="1매"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 30}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 30 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(30);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="absolute w-full h-fit top-108">
                  <RightStart />

                  {/* 35렙 */}
                  <div className="absolute w-24 h-24 z-1 -top-7 xl:-top-12 left-[50%]">
                    <Reward
                      level={35}
                      brand={vips}
                      reward="이만원"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 35}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 35 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(35);
                        }
                      }}
                    />
                  </div>

                  {/* 40렙 */}
                  <div className="absolute w-24 h-24 z-1 top-2 xl:-top-4 -left-3 xl:-left-6">
                    <Reward
                      level={40}
                      brand={baskin}
                      reward="패밀리"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 40}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 40 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(40);
                        }
                      }}
                    />
                  </div>

                  {/* 45렙 */}
                  <div className="absolute w-24 h-24 z-2 top-28 xl:top-24 left-[35%]">
                    <Reward
                      level={45}
                      brand={cgv}
                      reward="2매"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 45}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 45 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(45);
                        }
                      }}
                    />
                  </div>

                  {/* 50렙 */}
                  <div className="absolute w-24 h-24 z-1 top-28 xl:top-24 left-[85%]">
                    <Reward
                      level={50}
                      brand={vips}
                      reward="오만원"
                      isDone={!!userInfo && isLoggedIn && userInfo.level >= 50}
                      onClick={() => {
                        if ((userInfo?.level ?? 0) >= 50 && isLoggedIn) {
                          setIsOpen(true);
                          setSelectedLevel(50);
                        }
                      }}
                    />
                    <div className="absolute top-8 xl:top-12 -left-12 sm:-left-20 bg-primaryGreen-40 h-4 w-20 sm:w-30 -z-1"></div>
                  </div>
                </div>
              </div>
              {/*  */}
            </div>
          </div>
          <div className="w-full lg:w-70 flex flex-col gap-4">
            {loading ? (
              <div className="flex flex-col h-20 justify-center p-3 gap-1 text-white rounded-xl items-center">
                <span className="">사용자 정보를 불러오고 있어요</span>
              </div>
            ) : userInfo && isLoggedIn ? (
              <div
                onClick={() => navigate('/mypage/profile')}
                className="flex flex-col h-fit justify-between p-3 gap-1 text-white bg-primaryGreen rounded-xl cursor-pointer transform-all duration-200 hover:bg-[#6ab6c4]"
              >
                <p className="">{userInfo?.nickname} </p>
                <div className="flex gap-2 items-center">
                  <span className="text-xl font-bold">
                    Lv.{userInfo?.level}
                  </span>
                  <ProgressBar current={userInfo.exp} max={50} />
                </div>
              </div>
            ) : (
              <div className="break-keep flex flex-col h-fit justify-between p-3 gap-1 text-gray-500 bg-gray-200 rounded-xl">
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
          {selectedLevel === 1 && (
            <img src={giftLv1} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 5 && (
            <img src={giftLv5} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 10 && (
            <img src={giftLv10} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 15 && (
            <img src={giftLv15} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 20 && (
            <img src={giftLv20} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 25 && (
            <img src={giftLv25} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 30 && (
            <img src={giftLv30} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 35 && (
            <img src={giftLv35} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 40 && (
            <img src={giftLv40} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 45 && (
            <img src={giftLv45} alt="기프티콘" className="w-60" />
          )}
          {selectedLevel === 50 && (
            <img src={giftLv50} alt="기프티콘" className="w-60" />
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
