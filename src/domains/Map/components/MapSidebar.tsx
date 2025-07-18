import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapImage from '@/assets/image/MapImage.svg';
import starImage from '@/assets/image/StarImage.svg';
import roadImage from '@/assets/image/roadImage.svg';
import benefitImage from '@/assets/image/BenefitImage.svg';
import MapSection from './MapSection';
import UserSection from './UserSection';
import DetailSection from './DetailSection';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { mockStores, type StoreInfo } from '../MockStore';

//메뉴 타입 및 매핑된 아이콘 배열
type MenuType = '지도' | '즐겨찾기' | '길찾기' | '혜택인증';
const menus: MenuType[] = ['지도', '즐겨찾기', '길찾기', '혜택인증'];
const menuIcons = [mapImage, starImage, roadImage, benefitImage];

export default function MapSidebar() {
  // 열린 패널 스택: ['menu' 혹은 'detail', 메뉴 타입, 상세 아이템]
  const [panels, setPanels] = useState<
    {
      type: 'menu' | 'detail';
      menu: MenuType;
      item?: StoreInfo;
    }[]
  >([]);
  const stores = mockStores; // 샘플 매장 데이터

  // 메뉴 버튼 클릭: 가장 상위 패널을 메뉴 타입으로 초기화
  const openMenu = (menu: MenuType) => setPanels([{ type: 'menu', menu }]);

  //매장 클릭: 상세 패널 추가
  const openDetail = (store: StoreInfo) => {
    const currentMenu = panels[0]?.menu;
    if (!currentMenu) return; // 메뉴가 없으면 동작 중지
    setPanels([
      { type: 'menu', menu: currentMenu }, // 메뉴 패널 유지
      { type: 'detail', menu: currentMenu, item: store }, // 상세 패널 추가
    ]);
  };

  ///패널 닫기: 해당 인덱스 이후 패널 제거
  const closePanel = (index: number) =>
    setPanels((prev) => prev.slice(0, index));

  // Framer Motion 슬라이드 애니메이션 정의
  const slideVariants = {
    hidden: { x: -332, opacity: 0 }, // 왼쪽으로 이동하며 투명
    visible: { x: 0, opacity: 1 }, // 제자리 불투명
    exit: { x: -332, opacity: 0 }, // 다시 왼쪽으로
  };

  return (
    <div className="relative w-full h-dvh flex">
      {/* ====== 왼쪽 고정 메뉴 ====== */}
      <div className="fixed top-16 left-0 bottom-0 w-[90px] bg-gray-50 border-r text-center space-y-2 py-10 z-20">
        {menus.map((menu, idx) => (
          <button
            key={menu}
            onClick={() => openMenu(menu)}
            className={clsx(
              'w-20 flex flex-col items-center focus:outline-none',
              panels[0]?.menu === menu && 'bg-[#DDF4FF]', // 선택된 메뉴 강조
            )}
          >
            <img src={menuIcons[idx]} alt={menu} className="h-10 w-10 mb-1" />{' '}
            {/* 메뉴 아이콘 */}
            <span className="text-sm">{menu}</span> {/* 메뉴 이름 */}
          </button>
        ))}
      </div>

      {/* ====== 사이드바 패널 ====== */}
      <AnimatePresence initial={false}>
        {panels.map((panel, idx) => {
          const left = 64 + idx * 345; // 패널 겹침 간격
          const isDetail = panel.type === 'detail'; // 상세 패널 판단
          return (
            <motion.div
              key={idx}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={clsx(
                'absolute -top-2 w-[332px] bg-white rounded-2xl shadow-2xl z-10 ml-6',
                isDetail
                  ? 'h-[800px] translate-y-4' // 상세: 높이 고정, 살짝 아래
                  : 'bottom-0', // 메뉴: 화면 하단까지
              )}
              style={{ left }}
            >
              {/* 카드 타입 콘텐츠 영역 */}
              <div className="p-4 bg-white shadow-lg rounded-lg">
                {/* 첫 패널에만 사용자 정보 표시 */}
                {idx === 0 && (
                  <UserSection
                    username="김민석"
                    level={1}
                    currentExp={5}
                    nextLevelExp={20}
                  />
                )}

                {/* 메뉴 및 상세 컨텐츠 분기 */}
                {panel.type === 'menu' && panel.menu === '지도' && (
                  <MapSection openDetail={openDetail} stores={stores} />
                )}
                {panel.type === 'detail' && panel.item && (
                  <DetailSection store={panel.item} />
                )}
              </div>

              {/* 패널 닫기 버튼 */}
              <button
                onClick={() => closePanel(idx)}
                className="absolute right-0 translate-x-10 w-10 h-12 bottom-[55%] focus:outline-none bg-white border-2 rounded-lg border-gray-200"
              >
                <ChevronLeft
                  className="translate-x-1.5 text-gray-300"
                  strokeWidth={3}
                />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
