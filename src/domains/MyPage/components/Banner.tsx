import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import gifticonImg from '@/assets/icons/banner/bannerGift.svg';
import missionImg from '@/assets/icons/banner/bannerMission.svg';
import benefitImg from '@/assets/icons/banner/bannerBenefit.svg';
import rankingImg from '@/assets/icons/banner/bannerRank.svg';

const Banner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pagination = {
    clickable: true,
    renderBullet: function (index: number, className: string) {
      return '<span class="' + className + '" key="' + index + '"></span>';
    },
  };

  const slideData = [
    {
      title: '레벨업하고 기프티콘 받자!',
      desc: '경험치 쌓고 레벨업하면 기프티콘 보상까지!',
      cta: '기프티콘 확인하기',
      bgColor: 'bg-[#eb1d1d]',
      path: '/explore/reward',
      img: gifticonImg,
    },
    {
      title: '혜택 인증하고 레벨업 하자!',
      desc: '지도 페이지에서 혜택 내역을 인증하면 경험치가 쑥쑥!',
      cta: '지금 인증하기',
      bgColor: 'bg-[#f36d00]',
      path: '/map',
      img: benefitImg,
    },
    {
      title: '미션 완료하고 경험치 모으기!',
      desc: '미션을 완료하면 경험치를 받을 수 있어요. 놓치지 마세요!',
      cta: '미션 확인하기',
      bgColor: 'bg-[#858200]',
      path: '/mypage/missions',
      img: missionImg,
    },
    {
      title: '내 혜택 순위, 얼마나 높을까?',
      desc: '나의 순위는 어디쯤일까요? 다른 사람과 비교해보세요!',
      cta: '순위 보러가기',
      bgColor: 'bg-[#351ace]',
      path: '/explore/rankings',
      img: rankingImg,
    },
  ];

  const filteredSlideData =
    location.pathname === '/map'
      ? slideData // /map 일 때는 모두 보여줌
      : slideData.filter((slide) => slide.path !== location.pathname);

  return (
    <>
      <Swiper
        pagination={pagination}
        modules={[Pagination, Autoplay]}
        className="w-full rounded-xl hover:brightness-95 transition duration-200 select-none border border-primaryGreen"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
      >
        {filteredSlideData.map((slide, index) => (
          <SwiperSlide key={index} className={``}>
            <div className="flex flex-col md:h-[90%] p-3 gap-0 text-gray-700 justify-between">
              <div className="flex flex-col gap-0">
                <div className="flex gap-4 justify-between">
                  <div>
                    <p className="font-bold text-base">{slide.title}</p>
                    <p className="text-sm h-10">{slide.desc}</p>
                  </div>
                  <div className="">
                    <img
                      src={slide.img}
                      alt={slide.cta}
                      className="w-12 md:w-18"
                    />
                  </div>
                </div>
              </div>
              <p className="w-full text-end font-bold pb-3">
                <span
                  className="cursor-pointer p-2 text-sm"
                  onClick={() => {
                    if (slide.path === '/map') {
                      navigate('/map?autoClick=true');
                    } else if (
                      slide.path === '/mypage/missions' &&
                      !isLoggedIn
                    ) {
                      setIsModalOpen(true);
                    } else if (slide.path) {
                      navigate(slide.path);
                    }
                  }}
                >
                  {slide.cta}
                </span>
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
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

export default Banner;
