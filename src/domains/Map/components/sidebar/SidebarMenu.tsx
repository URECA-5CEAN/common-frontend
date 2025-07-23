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
            'py-2 w-12 h-12 flex flex-col shadow sm:shadow-none bg-primaryGreen-40 ml-[5px] items-center focus:outline-none cursor-pointer hover:bg-[#DDF4FF]',
            activeMenu === menu && 'bg-[#DDF4FF]',
            'sm:bg-inherit rounded-full sm:rounded sm:w-20 sm:h-20 ',
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
