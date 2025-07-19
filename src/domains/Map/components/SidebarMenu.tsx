import clsx from 'clsx';
import type { MenuType } from './MapSidebar';

interface SidebarMenuProps {
  menus: MenuType[];
  icons: string[];
  activeMenu?: MenuType;
  onSelect: (menu: MenuType) => void;
}

export default function SidebarMenu({
  menus,
  icons,
  activeMenu,
  onSelect,
}: SidebarMenuProps) {
  return (
    <div className="fixed top-16 left-0 bottom-0 w-[90px] bg-gray-50 border-r text-center space-y-2 py-10 z-20">
      {menus.map((menu, idx) => (
        <button
          key={menu}
          onClick={() => onSelect(menu)}
          className={clsx(
            'w-20 flex flex-col items-center focus:outline-none',
            activeMenu === menu && 'bg-[#DDF4FF]',
          )}
        >
          <img src={icons[idx]} alt={menu} className="h-10 w-10 mb-1" />
          <span className="text-sm">{menu}</span>
        </button>
      ))}
    </div>
  );
}
