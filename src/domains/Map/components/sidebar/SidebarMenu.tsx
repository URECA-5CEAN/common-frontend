import clsx from 'clsx';
import type { MenuType } from './MapSidebar';

interface SidebarMenuProps {
  menus: MenuType[];
  icons: string[];
  activeMenu?: MenuType; //선택된 메뉴 애니메이션 위해
  onSelect: (menu: MenuType) => void; //메뉴선택
  setIsBenefitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SidebarMenu({
  menus,
  icons,
  activeMenu,
  onSelect,
  setIsBenefitModalOpen,
}: SidebarMenuProps) {
  return (
    <div className="fixed top-28 md:top-16 right-6 md:left-0  md:bottom-0 md:w-[90px] md:bg-gray-50 md:shadow text-center space-y-2 pt-10 z-1 ">
      {menus.map((menu, idx) => (
        <button
          key={`${menu}-${idx}`}
          onClick={
            menu === '혜택인증'
              ? () => setIsBenefitModalOpen(true)
              : () => onSelect(menu)
          }
          className={clsx(
            'flex flex-col items-center justify-center',
            'transition-transform duration-150 ease-out',
            'focus:outline-none cursor-pointer',

            // 모바일 전용
            'w-12 h-12 bg-gray-50 rounded-full shadow-md z-1',
            'active:scale-95 active:opacity-80',
            'hover:shadow-lg hover:bg-primaryGreen-50',
            activeMenu === menu && 'bg-primaryGreen-60 shadow-lg ',

            // 데스크탑(mdall 이상)
            'md:w-20 md:h-20 md:rounded-none md:shadow-none  md:hover:shadow-none ml-1.5',
            ' md:hover:bg-[#DDF4FF] md:active:scale-100 md:active:opacity-100',
            activeMenu === menu && 'md:bg-[#DDF4FF] ',
          )}
        >
          <img
            src={icons[idx]}
            alt={menu}
            className="h-6 w-6  md:h-10 md:w-10 mb-0.5 md:mb-1 "
          />
          <span className="text-[8px] font-semibold md:font-medium md:text-sm">
            {menu}
          </span>
        </button>
      ))}
    </div>
  );
}
