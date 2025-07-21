import React, { ReactNode, useState, type ChangeEventHandler } from 'react';
import { AnimatePresence } from 'framer-motion';
import mapImage from '@/assets/image/MapImage.svg';
import starImage from '@/assets/image/StarImage.svg';
import roadImage from '@/assets/image/roadImage.svg';
import benefitImage from '@/assets/image/BenefitImage.svg';

import SidebarPanel from './SidebarPanel';
import SidebarMenu from './SidebarMenu';
import type { StoreInfo } from '../api/store';

interface sideBarProps {
  stores: StoreInfo[];
  onStoreSelect: (store: StoreInfo) => void;
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  keyword?: string;
}

//메뉴 타입 및 매핑된 아이콘 배열
export type MenuType = '지도' | '즐겨찾기' | '길찾기' | '혜택인증';
const menus: MenuType[] = ['지도', '즐겨찾기', '길찾기', '혜택인증'];
const menuIcons = [mapImage, starImage, roadImage, benefitImage];

export default function MapSidebar({
  stores,
  onStoreSelect,
  changeKeyword,
  keyword,
}: sideBarProps) {
  // 열린 패널 스택: ['menu' 혹은 'detail', 메뉴 타입, 상세 아이템]
  const [panels, setPanels] = useState<
    {
      type: 'menu' | 'detail';
      menu: MenuType;
      item?: StoreInfo;
    }[]
  >([]);

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

    onStoreSelect(store);
  };
  ///패널 닫기: 해당 인덱스 이후 패널 제거
  const closePanel = (index: number) =>
    setPanels((prev) => prev.slice(0, index));

  return (
    <>
      <SidebarMenu
        menus={menus}
        icons={menuIcons}
        activeMenu={panels[0]?.menu}
        onSelect={openMenu}
      />
      <AnimatePresence>
        {panels.map((panel, idx) => (
          <SidebarPanel
            key={idx}
            index={idx}
            panel={panel}
            stores={stores} // 매장 리스트 전달
            openDetail={openDetail} // 상세 콜백 전달
            onClose={closePanel}
            changeKeyword={changeKeyword}
            keyword={keyword}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
