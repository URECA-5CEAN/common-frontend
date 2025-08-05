import clsx from 'clsx';
import type { MenuType } from './MapSidebar';
import type { Dispatch, SetStateAction } from 'react';

interface SidebarMenuProps {
  menus: MenuType[];
  icons: string[];
  activeMenu?: MenuType; //선택된 메뉴 애니메이션 위해
  onSelect: (menu: MenuType) => void; //메뉴선택
  setIsBenefitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function SidebarMenu({
  menus,
  icons,
  activeMenu,
  onSelect,
  setIsBenefitModalOpen,
  setIsOpen,
}: SidebarMenuProps) {
  return (
    <div className="fixed top-28 md:top-10 right-6 md:left-0  md:bottom-0 md:w-[70px] md:bg-gray-50 md:shadow text-center space-y-2 mt-10 z-1">
      {menus.map((menu, idx) => (
        <button
          key={`${menu}-${idx}`}
          onClick={() => {
            if (menu === '혜택인증') {
              setIsBenefitModalOpen(true);
              return;
            }
            if (menu === '즐겨찾기') {
              setIsOpen(true);
            }
            onSelect(menu);
          }}
          className={clsx(
            'flex flex-col items-center justify-center',
            'transition-transform duration-150 ease-out',
            'focus:outline-none cursor-pointer',

            // 모바일 전용
            'w-12 h-12 bg-gray-50 rounded-full shadow-md z-1 font-semibold',
            'active:scale-95 active:opacity-80',
            'hover:shadow-lg hover:bg-primaryGreen-50',
            activeMenu === menu && 'bg-primaryGreen-60 shadow-lg ',

            // 데스크탑(mdall 이상)
            'md:w-14 md:h-16 md:rounded-lg md:shadow-none  md:hover:shadow-none ml-[7px]',
            ' md:hover:bg-[#DDF4FF] md:active:scale-100 md:active:opacity-100 md:transition-[background-color] md:duration-100',
            activeMenu === menu &&
              'md:bg-[#DDF4FF] md:text-[#1CB0F7] md:border-2 md:border-[#84D8FF] md:hover:bg-[#cee8f5]',
          )}
        >
          <img
            src={icons[idx]}
            alt={menu}
            className="h-6 w-6  md:h-7 md:w-7 mb-0.5 md:mb-1 "
          />
          <span
            className={`text-[8px] md:text-sm ${activeMenu === menu ? 'md:font-bold' : 'md:font-medium text-gray-500'} `}
          >
            {menu}
          </span>
        </button>
      ))}
    </div>
  );
}
