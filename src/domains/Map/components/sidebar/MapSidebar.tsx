// src/components/MapSidebar.tsx

import { type ChangeEventHandler } from 'react';
import { AnimatePresence } from 'framer-motion';
import mapImage from '@/assets/image/MapImage.svg';
import starImage from '@/assets/image/StarImage.svg';
import roadImage from '@/assets/image/roadImage.svg';
import benefitImage from '@/assets/image/BenefitImage.svg';

import SidebarMenu from './SidebarMenu';
import SidebarPanel from './SidebarPanel';
import type { StoreInfo } from '../../api/store';
import BottomSheet, { type BottomSheetHandle } from './BottomSheet';

// 메뉴 타입
export type MenuType = '지도' | '즐겨찾기' | '길찾기' | '혜택인증';
export const menus: MenuType[] = ['지도', '즐겨찾기', '길찾기', '혜택인증'];
export const menuIcons = [mapImage, starImage, roadImage, benefitImage];

// Panel 타입 (MapPage에서 관리)
export type Panel =
  | { type: 'menu'; menu: MenuType }
  | { type: 'detail'; menu: MenuType; item: StoreInfo };

interface SideBarProps {
  stores: StoreInfo[];
  panel: Panel; // <- MapPage에서 내려받는 현재 메뉴
  openMenu: (menu: MenuType) => void; // <- 메뉴 변경 콜백
  openDetail: (store: StoreInfo) => void; // <- 상세 열기 콜백
  onClose: (index: number) => void; // <- 패널 닫기 콜백
  changeKeyword?: ChangeEventHandler<HTMLInputElement>;
  keyword?: string;
  startValue: string;
  endValue: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
  onSwap: () => void;
  onReset: () => void;
  onNavigate: () => void;
  bookmarks: StoreInfo[];
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>;
  goToStore: (store: StoreInfo) => void;
  sheetRef: React.RefObject<BottomSheetHandle | null>;
  onSheetPositionChange: (y: number) => void;
}

export default function MapSidebar({
  stores,
  panel,
  openMenu,
  openDetail,
  onClose,
  changeKeyword,
  keyword,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  onSwap,
  onReset,
  onNavigate,
  bookmarks,
  toggleBookmark,
  bookmarkIds,
  goToStore,
  sheetRef,
  onSheetPositionChange,
}: SideBarProps) {
  if (!panel) return;

  //메뉴 선택 시 openMenu 호출 + 시트를 middle 위치로 스냅
  const onMenuSelect = (menu: MenuType) => {
    openMenu(menu);
    sheetRef.current?.snapTo('middle');
  };

  return (
    <>
      {/* 최상단 메뉴 */}
      <SidebarMenu
        menus={menus}
        icons={menuIcons}
        activeMenu={panel?.menu}
        onSelect={onMenuSelect}
      />

      <div className="hidden md:block">
        {/* 패널 애니메이션 */}
        <AnimatePresence initial={false}>
          {/* 메뉴 패널 (always render) */}
          <SidebarPanel
            key="menu"
            index={0}
            panel={panel}
            stores={stores}
            openDetail={openDetail}
            onClose={onClose}
            changeKeyword={changeKeyword}
            keyword={keyword}
            startValue={startValue}
            endValue={endValue}
            onStartChange={onStartChange}
            onEndChange={onEndChange}
            onSwap={onSwap}
            onReset={onReset}
            onNavigate={onNavigate}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            bookmarkIds={bookmarkIds}
            goToStore={goToStore}
          />

          {/* 상세 패널 (panel.type이 'detail'일 때만) */}
          {panel?.type === 'detail' && panel.item && (
            <SidebarPanel
              key="detail"
              index={1}
              bookmarks={bookmarks}
              panel={panel}
              stores={stores}
              openDetail={openDetail}
              onClose={onClose}
              changeKeyword={changeKeyword}
              keyword={keyword}
              onStartChange={onStartChange}
              onEndChange={onEndChange}
              toggleBookmark={toggleBookmark}
              bookmarkIds={bookmarkIds}
              goToStore={goToStore}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="block md:hidden">
        {/* 패널 애니메이션 */}
        <AnimatePresence initial={false}>
          {panel?.type === 'menu' && (
            <BottomSheet
              key="menu-mobile"
              ref={sheetRef}
              isOpen={panel.type === 'menu'}
              onClose={() => onClose(0)}
              onPositionChange={onSheetPositionChange}
            >
              {/* 메뉴 패널 (always render) */}
              <SidebarPanel
                key="menu"
                index={0}
                panel={panel}
                stores={stores}
                openDetail={openDetail}
                onClose={onClose}
                changeKeyword={changeKeyword}
                keyword={keyword}
                startValue={startValue}
                endValue={endValue}
                onStartChange={onStartChange}
                onEndChange={onEndChange}
                onSwap={onSwap}
                onReset={onReset}
                onNavigate={onNavigate}
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                bookmarkIds={bookmarkIds}
                goToStore={goToStore}
              />
            </BottomSheet>
          )}
          {/* 상세 패널 (panel.type이 'detail'일 때만) */}
          {panel?.type === 'detail' && panel.item && (
            <BottomSheet
              key="detail-mobile"
              ref={sheetRef}
              isOpen={panel.type === 'detail'}
              onClose={() => onClose(1)}
              onPositionChange={onSheetPositionChange}
            >
              <SidebarPanel
                key="detail"
                index={1}
                bookmarks={bookmarks}
                panel={panel}
                stores={stores}
                openDetail={openDetail}
                onClose={onClose}
                changeKeyword={changeKeyword}
                keyword={keyword}
                onStartChange={onStartChange}
                onEndChange={onEndChange}
                toggleBookmark={toggleBookmark}
                bookmarkIds={bookmarkIds}
                goToStore={goToStore}
              />
            </BottomSheet>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
