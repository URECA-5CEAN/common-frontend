import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapImage from '@/assets/image/MapImage.svg';
import starImage from '@/assets/image/StarImage.svg';
import roadImage from '@/assets/image/roadImage.svg';
import benefitImage from '@/assets/image/BenefitImage.svg';
import MapSection from './MapSection';
import UserSection from './UserSection';
// Button 컴포넌트
interface ButtonProps {
  children: ReactNode;
  variant?: 'default' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
  onClick?: () => void;
}
function Button({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  onClick,
}: ButtonProps) {
  const base = 'px-3 py-1.5 border rounded-md focus:outline-none';
  const variants = {
    default: 'bg-white text-black border-gray-300',
    secondary: 'bg-[#DDF4FF] text-white border-primaryGreen-60',
    ghost: 'bg-transparent text-gray-700 border-transparent',
  };
  const sizes = { sm: 'text-sm', md: 'text-base' };
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

// CardContent 컴포넌트
interface CardContentProps {
  children: ReactNode;
  className?: string;
}
function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`p-4 bg-white shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
}

// ScrollArea 컴포넌트
interface ScrollAreaProps {
  children: ReactNode;
  className?: string;
}
function ScrollArea({ children, className = '' }: ScrollAreaProps) {
  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ maxHeight: 'calc(100vh - 100px)' }}
    >
      {children}
    </div>
  );
}

// 첫 번째 패널 메뉴 타입
type MenuType = '지도' | '길찾기' | '즐겨찾기' | '혜택인증';
// 패널 스테이트
interface PanelState {
  type: 'menu' | 'detail' | 'more';
  menu?: MenuType;
  item?: string;
}

const MenuImage = [mapImage, starImage, roadImage, benefitImage];

export default function MapSidebar() {
  const [panels, setPanels] = useState<PanelState[]>([]);

  // 첫 번째 메뉴 클릭
  const openMenu = (menu: MenuType) => {
    setPanels([{ type: 'menu', menu }]);
  };
  // 두 번째: 메뉴 패널 내 아이템 클릭
  const openDetail = (item: string) => {
    setPanels([
      { type: 'menu', menu: panels[0].menu },
      { type: 'detail', menu: panels[0].menu, item },
    ]);
  };

  // 패널 닫기
  const closePanel = (index: number) => {
    setPanels((prev) => prev.slice(0, index));
  };

  // 메뉴별 리스트
  const contentMap: Record<MenuType, string[]> = {
    지도: ['위치1', '위치2'],
    즐겨찾기: ['북마크1', '북마크2'],
    길찾기: ['출발지', '도착지'],
    혜택인증: ['쿠폰A', '쿠폰B'],
  };

  const slideVariants = {
    hidden: (dir: number) => ({ x: dir * 300, opacity: 0 }),
    visible: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * 300, opacity: 0 }),
  };

  const baseLeft = 64;

  return (
    <div className="relative w-full h-dvh flex">
      {/* 왼쪽 고정 메뉴 */}
      <div className="fixed top-16 left-0 bottom-0 flex flex-col w-[90px] bg-gray-50 border-r border-gray-200 z-20 text-center space-y-2">
        <div className="mt-10">
          {Object.keys(contentMap).map((m, idx) => (
            <Button
              key={m}
              className="w-20"
              variant={panels[0]?.menu === m ? 'secondary' : 'ghost'}
              onClick={() => openMenu(m as MenuType)}
            >
              <img
                src={MenuImage[idx]}
                alt={m}
                className=" h-[40px] w-[40px] mb-1 ml-2"
              />
              <span className="text-sm">{m}</span>
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false} custom={1}>
        {panels.map((panel, idx) => {
          const dir = panel.type === 'detail' ? -1 : idx === 0 ? -1 : 1;
          const left = baseLeft + idx * 256;
          return (
            <motion.div
              key={idx}
              custom={dir}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute -top-2 bottom-0 w-[332px] bg-white z-10 ml-6"
              style={{ left }}
            >
              <CardContent>
                <UserSection
                  username="김민석"
                  level={1}
                  currentExp={5}
                  nextLevelExp={20}
                />
                {panel.type === 'menu' && panel.menu === '지도' && (
                  <MapSection />
                )}
              </CardContent>
              <Button size="sm" onClick={() => closePanel(idx)}>
                ✕
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 ml-16 p-8">
        <h1 className="text-2xl font-bold">메인 컨텐츠</h1>
      </div>
    </div>
  );
}
