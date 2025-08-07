import {
  lazy,
  memo,
  Suspense,
  useState,
  type ChangeEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { AnimatePresence } from 'framer-motion';
import mapImage from '@/assets/image/MapImage.svg';
import starImage from '@/assets/image/StarImage.svg';
import roadImage from '@/assets/image/roadImage.svg';
import benefitImage from '@/assets/image/BenefitImage.svg';

import SidebarMenu from './SidebarMenu';
import type { StoreInfo } from '../../api/store';
import { type BottomSheetHandle } from './BottomSheet';
import type { LocationInfo } from '../../pages/MapPage';
import type { RouteItem } from './RoadSection';
const SidebarPanel = lazy(() => import('./SidebarPanel'));
const BottomSheet = lazy(() => import('./BottomSheet'));
// 메뉴 타입
export type MenuType = '지도' | '즐겨찾기' | '길찾기' | '혜택인증';
export const menus: MenuType[] = ['지도', '즐겨찾기', '길찾기', '혜택인증'];
export const menuIcons = [mapImage, starImage, roadImage, benefitImage];

// Panel 타입 (MapPage에서 관리)
export type Panel =
  | { type: 'menu'; menu: MenuType }
  | { type: 'detail'; menu: MenuType; item: StoreInfo }
  | { type: 'road'; menu: MenuType; item: RouteItem };

interface SideBarProps {
  stores: StoreInfo[];
  panel: Panel; // MapPage에서 내려받는 현재 메뉴
  openMenu: (menu: MenuType) => void; //  메뉴 변경 콜백
  openDetail: (store: StoreInfo) => void; //  상세 열기 콜백
  onClose: (index: number) => void; //  패널 닫기 콜백
  changeKeyword?: ChangeEventHandler<HTMLInputElement>; //키워드 바꿔주는 콜백
  keyword: string;
  startValue: LocationInfo; //출발지
  endValue: LocationInfo; // 도착지
  onStartChange: (v: LocationInfo) => void;
  onEndChange: (v: LocationInfo) => void;
  onSwap: () => void;
  onReset: () => void;
  bookmarks: StoreInfo[];
  toggleBookmark: (store: StoreInfo) => void;
  bookmarkIds: Set<string>; // 즐겨찾기인지 확인
  goToStore: (store: StoreInfo) => void; //해당 제휴처로 이동
  sheetRef: React.RefObject<BottomSheetHandle | null>;
  onSheetPositionChange: (y: number) => void; // 바텀시트 y좌표 콜백
  sheetDetail: React.RefObject<BottomSheetHandle | null>;
  onDetailSheetPositionChange: (y: number) => void;
  openRoadDetail: (route: RouteItem) => void;
  index: number;
  setStartValue: Dispatch<SetStateAction<LocationInfo>>;
  setEndValue: Dispatch<SetStateAction<LocationInfo>>;
  resetKeyword: () => void;
  selectedCardId: string;
  SetKeyword: Dispatch<SetStateAction<string>>;
  searchInput: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  mode: 'default' | 'search';
  setMode: Dispatch<SetStateAction<'default' | 'search'>>;
  searchStores: StoreInfo[];
  setStartInput: Dispatch<SetStateAction<string>>;
  setEndInput: Dispatch<SetStateAction<string>>;
  setWayInput: Dispatch<SetStateAction<string>>;
  setIsBenefitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusField: Dispatch<SetStateAction<'start' | 'end' | number | null>>;
  focusField: 'start' | 'end' | number | null;
  isMainLoading: boolean;
  waypoints: LocationInfo[];
  setWaypoints: Dispatch<SetStateAction<LocationInfo[]>>;
}
function MapSidebar({
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
  bookmarks,
  toggleBookmark,
  bookmarkIds,
  goToStore,
  sheetRef,
  onSheetPositionChange,
  sheetDetail,
  onDetailSheetPositionChange,
  openRoadDetail,
  // index,
  setStartValue,
  setEndValue,
  resetKeyword,
  selectedCardId,
  SetKeyword,
  searchInput,
  handleSearchChange,
  mode,
  setMode,
  searchStores,
  setStartInput,
  setEndInput,
  setWayInput,
  setIsBenefitModalOpen,
  setFocusField,
  focusField,
  isMainLoading,
  waypoints,
  setWaypoints,
}: SideBarProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //메뉴 선택 시 openMenu 호출 + 시트를 middle 위치로 스냅
  const onMenuSelect = (menu: MenuType) => {
    openMenu(menu);
    sheetRef.current?.snapTo('middle');
  };

  const onCloseSheet = () => {
    sheetDetail.current?.snapTo('bottom');
  };

  if (!panel) return;

  return (
    <>
      {/* 최상단 메뉴 */}
      <SidebarMenu
        menus={menus}
        icons={menuIcons}
        activeMenu={panel?.menu}
        onSelect={onMenuSelect}
        setIsBenefitModalOpen={setIsBenefitModalOpen}
        setIsOpen={setIsModalOpen}
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
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            bookmarkIds={bookmarkIds}
            goToStore={goToStore}
            openRoadDetail={openRoadDetail}
            setStartValue={setStartValue}
            setEndValue={setEndValue}
            resetKeyword={resetKeyword}
            selectedCardId={selectedCardId}
            SetKeyword={SetKeyword}
            searchInput={searchInput}
            handleSearchChange={handleSearchChange}
            mode={mode}
            setMode={setMode}
            searchStores={searchStores}
            setStartInput={setStartInput}
            setEndInput={setEndInput}
            setWayInput={setWayInput}
            setFocusField={setFocusField}
            focusField={focusField}
            isMainLoading={isMainLoading}
            setIsOpen={setIsModalOpen}
            isOpen={isModalOpen}
            waypoints={waypoints}
            setWaypoints={setWaypoints}
          />

          {/* 상세 패널 (panel.type이 'detail'일 때만) */}
          {(panel?.type === 'detail' || panel.type === 'road') &&
            panel.item && (
              <Suspense fallback={<div>로딩 중…</div>}>
                <SidebarPanel
                  key="detail"
                  index={1}
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
                  bookmarks={bookmarks}
                  toggleBookmark={toggleBookmark}
                  bookmarkIds={bookmarkIds}
                  goToStore={goToStore}
                  openRoadDetail={openRoadDetail}
                  setStartValue={setStartValue}
                  setEndValue={setEndValue}
                  resetKeyword={resetKeyword}
                  selectedCardId={selectedCardId}
                  SetKeyword={SetKeyword}
                  searchInput={searchInput}
                  handleSearchChange={handleSearchChange}
                  mode={mode}
                  setMode={setMode}
                  searchStores={searchStores}
                  setStartInput={setStartInput}
                  setEndInput={setEndInput}
                  setWayInput={setWayInput}
                  setFocusField={setFocusField}
                  focusField={focusField}
                  isMainLoading={isMainLoading}
                  setIsOpen={setIsModalOpen}
                  isOpen={isModalOpen}
                  waypoints={waypoints}
                  setWaypoints={setWaypoints}
                />
              </Suspense>
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
              panelMenu={panel.menu}
              isOpen={panel.type === 'menu'}
              onClose={onCloseSheet}
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
                bookmarks={bookmarks}
                toggleBookmark={toggleBookmark}
                bookmarkIds={bookmarkIds}
                goToStore={goToStore}
                openRoadDetail={openRoadDetail}
                setStartValue={setStartValue}
                setEndValue={setEndValue}
                resetKeyword={resetKeyword}
                selectedCardId={selectedCardId}
                SetKeyword={SetKeyword}
                searchInput={searchInput}
                handleSearchChange={handleSearchChange}
                mode={mode}
                setMode={setMode}
                searchStores={searchStores}
                setStartInput={setStartInput}
                setEndInput={setEndInput}
                setWayInput={setWayInput}
                setFocusField={setFocusField}
                focusField={focusField}
                isMainLoading={isMainLoading}
                setIsOpen={setIsModalOpen}
                isOpen={isModalOpen}
                waypoints={waypoints}
                setWaypoints={setWaypoints}
              />
            </BottomSheet>
          )}
          {/* 상세 패널 (panel.type이 'detail'일 때만) */}
          {panel.type === 'detail' && panel.item && (
            <Suspense fallback={<div>로딩 중…</div>}>
              <BottomSheet
                key="detail-mobile"
                ref={sheetDetail}
                isOpen={
                  panel.type === 'detail' && (panel.item as unknown as boolean)
                }
                panelMenu={panel.menu}
                onClose={onCloseSheet}
                onPositionChange={onDetailSheetPositionChange}
              >
                <SidebarPanel
                  key="detail-mobile"
                  index={1}
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
                  bookmarks={bookmarks}
                  toggleBookmark={toggleBookmark}
                  bookmarkIds={bookmarkIds}
                  goToStore={goToStore}
                  openRoadDetail={openRoadDetail}
                  setStartValue={setStartValue}
                  setEndValue={setEndValue}
                  resetKeyword={resetKeyword}
                  selectedCardId={selectedCardId}
                  SetKeyword={SetKeyword}
                  searchInput={searchInput}
                  handleSearchChange={handleSearchChange}
                  mode={mode}
                  setMode={setMode}
                  searchStores={searchStores}
                  setStartInput={setStartInput}
                  setEndInput={setEndInput}
                  setWayInput={setWayInput}
                  setFocusField={setFocusField}
                  focusField={focusField}
                  isMainLoading={isMainLoading}
                  setIsOpen={setIsModalOpen}
                  isOpen={isModalOpen}
                  waypoints={waypoints}
                  setWaypoints={setWaypoints}
                />
              </BottomSheet>
            </Suspense>
          )}

          {panel?.type === 'road' && panel.item && (
            <Suspense fallback={<div>로딩 중…</div>}>
              <BottomSheet
                key="road-mobile"
                ref={sheetDetail}
                panelMenu={panel.menu}
                isOpen={panel.type === 'road'}
                onClose={onCloseSheet}
                onPositionChange={onDetailSheetPositionChange}
              >
                <SidebarPanel
                  key="road"
                  index={1}
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
                  bookmarks={bookmarks}
                  toggleBookmark={toggleBookmark}
                  bookmarkIds={bookmarkIds}
                  goToStore={goToStore}
                  openRoadDetail={openRoadDetail}
                  setStartValue={setStartValue}
                  setEndValue={setEndValue}
                  resetKeyword={resetKeyword}
                  selectedCardId={selectedCardId}
                  SetKeyword={SetKeyword}
                  searchInput={searchInput}
                  handleSearchChange={handleSearchChange}
                  mode={mode}
                  setMode={setMode}
                  searchStores={searchStores}
                  setStartInput={setStartInput}
                  setEndInput={setEndInput}
                  setWayInput={setWayInput}
                  setFocusField={setFocusField}
                  focusField={focusField}
                  isMainLoading={isMainLoading}
                  setIsOpen={setIsModalOpen}
                  isOpen={isModalOpen}
                  waypoints={waypoints}
                  setWaypoints={setWaypoints}
                />
              </BottomSheet>
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

export default memo(MapSidebar);
