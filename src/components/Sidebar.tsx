import { NavLink, useLocation } from 'react-router-dom';
import rankingIcon from '@/assets/icons/ranking_icon.png';
import shareIcon from '@/assets/icons/share_icon.png';
import profileIcon from '@/assets/icons/profile_icon.png';
import collectionIcon from '@/assets/icons/collection_icon.png';
import missionsIcon from '@/assets/icons/missions_icon.png';
import statisticsIcon from '@/assets/icons/statistics_icon.png';
import favoritesIcon from '@/assets/icons/favorites_icon.png';
import rewardIcon from '@/assets/icons/reward_icon.png';
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';

// 타입 정의
interface MenuItem {
  to: string;
  icon: string;
  label: string;
  alt: string;
}

// 상수 정의
const EXPLORE_MENU_ITEMS: MenuItem[] = [
  {
    to: '/explore/reward',
    icon: rewardIcon,
    label: '기프티콘',
    alt: '보상 아이콘',
  },
  {
    to: '/explore/rankings',
    icon: rankingIcon,
    label: '혜택 순위',
    alt: '순위 아이콘',
  },
  {
    to: '/explore/share',
    icon: shareIcon,
    label: '혜택 나누기',
    alt: '혜택나누기 아이콘',
  },
];

const MYPAGE_MENU_ITEMS: MenuItem[] = [
  {
    to: '/mypage/profile',
    icon: profileIcon,
    label: '내 정보',
    alt: '내 정보 아이콘',
  },
  {
    to: '/mypage/collection',
    icon: collectionIcon,
    label: '혜택 도감',
    alt: '혜택도감 아이콘',
  },
  {
    to: '/mypage/missions',
    icon: missionsIcon,
    label: '미션',
    alt: '미션 아이콘',
  },
  {
    to: '/mypage/statistics',
    icon: statisticsIcon,
    label: '통계',
    alt: '통계 아이콘',
  },
  {
    to: '/mypage/favorites',
    icon: favoritesIcon,
    label: '즐겨찾기',
    alt: '즐겨찾기 아이콘',
  },
  {
    to: '/mypage/share',
    icon: shareIcon,
    label: '내 나눔',
    alt: '내 나눔 아이콘',
  },
];

// 스타일 클래스 상수
const STYLES = {
  container:
    'overflow-y-auto hidden md:block md:fixed pt-[86px] bg-gray-100 border-r-1 border-r-gray-200 w-[240px] h-full top-0',
  menuContainer: 'py-4 px-4 flex flex-col gap-2',
  iconContainer: 'w-6 h-6 mr-2 flex items-center',
  icon: 'w-full h-full object-contain',
  linkBase:
    'h-12 flex items-center px-4 rounded-lg transition-[background-color] duration-100 border-2',
  linkActive:
    'font-bold bg-[#DDF4FF] border-[#84D8FF] text-[#1CB0F7] hover:bg-[#cee8f5]',
  linkInactive: 'hover:bg-[#f0f0f0] border-transparent text-gray-500',
};

// 하위 컴포넌트
const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const { handleProtectedNavigation } = useUnsavedChanges();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleProtectedNavigation(item.to);
  };

  const isActivePath =
    location.pathname === item.to ||
    location.pathname.startsWith(item.to + '/');

  return (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={handleClick}
      className={`${STYLES.linkBase} ${isActivePath ? STYLES.linkActive : STYLES.linkInactive}`}
    >
      <div className={STYLES.iconContainer}>
        <img src={item.icon} alt={item.alt} className={STYLES.icon} />
      </div>
      {item.label}
    </NavLink>
  );
};

const MenuList = ({ items }: { items: MenuItem[] }) => (
  <div className={STYLES.menuContainer}>
    {items.map((item: MenuItem) => (
      <MenuItemComponent key={item.to} item={item} />
    ))}
  </div>
);

// 메인 컴포넌트
const Sidebar = () => {
  const location = useLocation();

  // 현재 경로에 따른 메뉴 아이템 결정
  const getCurrentMenuItems = (): MenuItem[] => {
    if (location.pathname.startsWith('/explore/')) {
      return EXPLORE_MENU_ITEMS;
    }
    if (location.pathname.startsWith('/mypage/')) {
      return MYPAGE_MENU_ITEMS;
    }
    return [];
  };

  const currentMenuItems = getCurrentMenuItems();

  // 메뉴 아이템이 없으면 사이드바를 숨김
  if (currentMenuItems.length === 0) {
    return null;
  }

  return (
    <div className={STYLES.container}>
      <MenuList items={currentMenuItems} />
    </div>
  );
};

export default Sidebar;
