import clsx from 'clsx';
import type { MenuType } from './MapSidebar';

interface SidebarMenuProps {
  menus: MenuType[];
  icons: string[];
  activeMenu?: MenuType; //선택된 메뉴 애니메이션 위해
  onSelect: (menu: MenuType) => void; //메뉴선택
}

export default function SidebarMenu({
  menus,
  icons,
  activeMenu,
  onSelect,
}: SidebarMenuProps) {
  return (
    <div className="fixed top-16 right-6.5 sm:left-0  sm:bottom-0 sm:w-[90px] sm:bg-gray-50 sm:shadow text-center space-y-2 pt-10 z-0 sm:z-20">
      {menus.map((menu, idx) => (
        <button
          key={menu}
          onClick={() => onSelect(menu)}
          className={clsx(
            'flex flex-col items-center justify-center',
            'transition-transform duration-150 ease-out',
            'focus:outline-none cursor-pointer',

            // 모바일 전용
            'w-12 h-12 bg-gray-50 rounded-full shadow-md',
            'active:scale-95 active:opacity-80',
            'hover:shadow-lg hover:bg-primaryGreen-50',
            activeMenu === menu && 'bg-primaryGreen-60 shadow-lg ',

            // 데스크탑(small 이상)
            'sm:w-20 sm:h-20 sm:rounded-none sm:shadow-none sm:hover:shadow-none ml-1.5',
            ' sm:hover:bg-[#DDF4FF] sm:active:scale-100 sm:active:opacity-100',
            activeMenu === menu && 'sm:bg-[#DDF4FF] ',
          )}
        >
          <img
            src={icons[idx]}
            alt={menu}
            className="h-6 w-6  sm:h-10 sm:w-10 mb-0.5 sm:mb-1 "
          />
          <span className="text-[8px] font-semibold sm:font-medium sm:text-sm">
            {menu}
          </span>
        </button>
      ))}
    </div>
  );
}
