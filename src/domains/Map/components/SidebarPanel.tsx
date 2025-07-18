// SidebarPanel.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { MenuType, StoreInfo } from './types';
import UserSection from './UserSection';
import MapSection from './MapSection';
import StarSection from './StarSection';
import DetailSection from './DetailSection';
import { ChevronLeft } from 'lucide-react';

interface SidebarPanelProps {
  index: number;
  panel: { type: 'menu' | 'detail'; menu: MenuType; item?: StoreInfo };
  stores: StoreInfo[];
  openDetail: (store: StoreInfo) => void;
  onClose: (idx: number) => void;
}

export default function SidebarPanel({
  index,
  panel,
  stores,
  openDetail,
  onClose,
}: SidebarPanelProps) {
  const left = 64 + index * 345;
  const isDetail = panel.type === 'detail';

  return (
    <motion.div
      key={index}
      initial={{ x: -332, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -332, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={clsx(
        'absolute -top-2 w-[332px] bg-white rounded-2xl shadow-2xl z-10 ml-6',
        isDetail ? 'h-[800px] translate-y-4' : 'bottom-0',
      )}
      style={{ left }}
    >
      <div className="p-4 bg-white shadow-lg rounded-lg">
        {/* 첫 번째 패널: 사용자 정보 */}
        {index === 0 && (
          <UserSection
            username="김민석"
            level={1}
            currentExp={5}
            nextLevelExp={20}
          />
        )}

        {/* 메뉴 및 상세 분기 렌더링 */}
        {panel.type === 'menu' && panel.menu === '지도' && (
          <MapSection openDetail={openDetail} stores={stores} />
        )}
        {panel.type === 'menu' && panel.menu === '즐겨찾기' && (
          <StarSection openDetail={openDetail} stores={stores} />
        )}
        {panel.type === 'detail' && panel.item && (
          <DetailSection store={panel.item} />
        )}
      </div>

      {/* 패널 닫기 버튼 */}
      <button
        onClick={() => onClose(index)}
        className="absolute right-0 translate-x-10 w-10 h-12 bottom-[55%] focus:outline-none bg-white border-2 rounded-lg border-gray-200"
      >
        <ChevronLeft
          className="translate-x-1.5 text-gray-300"
          strokeWidth={3}
        />
      </button>
    </motion.div>
  );
}
