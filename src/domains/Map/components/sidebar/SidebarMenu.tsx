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
    <div className="fixed  top-16 right-5 md:left-0 bottom-0 md:w-[90px] md:bg-gray-50 shadow text-center space-y-2 py-10 z-20">
      {menus.map((menu, idx) => (
        <button
          key={menu}
          onClick={() => onSelect(menu)}
          className={clsx(
            'py-2 w-12 h-12 flex flex-col shadow md:shadow-none bg-primaryGreen-40 ml-[5px] items-center focus:outline-none cursor-pointer hover:bg-[#DDF4FF]',
            activeMenu === menu && 'bg-[#DDF4FF]',
            'md:bg-inherit rounded-full md:rounded md:w-20 md:h-20 ',
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
