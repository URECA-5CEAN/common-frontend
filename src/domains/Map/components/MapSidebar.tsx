// src/components/MapSidebar.tsx

import React, { type ChangeEventHandler } from 'react';
import { AnimatePresence } from 'framer-motion';
import mapImage from '@/assets/image/MapImage.svg';
import starImage from '@/assets/image/StarImage.svg';
import roadImage from '@/assets/image/roadImage.svg';
import benefitImage from '@/assets/image/BenefitImage.svg';

import SidebarMenu from './SidebarMenu';
import SidebarPanel from './SidebarPanel';
import type { StoreInfo } from '../api/store';

// 메뉴 타입
export type MenuType = '지도' | '즐겨찾기' | '길찾기' | '혜택인증';
export const menus: MenuType[] = ['지도', '즐겨찾기', '길찾기', '혜택인증'];
export const menuIcons = [mapImage, starImage, roadImage, benefitImage];

// Panel 타입 (MapPage에서 관리)
export type Panel = {
  type: 'menu' | 'detail';
  menu: MenuType;
  item?: StoreInfo;
};

interface SideBarProps {
  stores: StoreInfo[];
  panel: Panel; // <- MapPage에서 내려받는 현재 panel
  openMenu: (menu: MenuType) => void; // <- 메뉴 변경 콜백
  openDetail: (store: StoreInfo) => void; // <- 상세 열기 콜백
  onClose: (index: number) => void; // <- 패널 닫기 콜백
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  keyword?: string;
}

export default function MapSidebar({
  stores,
  panel,
  openMenu,
  openDetail,
  onClose,
  changeKeyword,
  keyword,
}: SideBarProps) {
  return (
    <>
      {/* 최상단 메뉴 */}
      <SidebarMenu
        menus={menus}
        icons={menuIcons}
        activeMenu={panel.menu}
        onSelect={openMenu}
      />

      {/* 패널 애니메이션 */}
      <AnimatePresence initial={false}>
        {/* 메뉴 패널 (always render) */}
        <SidebarPanel
          key="menu"
          index={0}
          panel={{ type: 'menu', menu: panel.menu }}
          stores={stores}
          openDetail={openDetail}
          onClose={onClose}
          changeKeyword={changeKeyword}
          keyword={keyword}
        />

        {/* 상세 패널 (panel.type이 'detail'일 때만) */}
        {panel.type === 'detail' && panel.item && (
          <SidebarPanel
            key="detail"
            index={1}
            panel={panel}
            stores={stores}
            openDetail={openDetail}
            onClose={onClose}
            changeKeyword={changeKeyword}
            keyword={keyword}
          />
        )}
      </AnimatePresence>
    </>
  );
}
