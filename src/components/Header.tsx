import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import menuIcon from '@/assets/icons/menu-hamburger.svg';
import arrowIcon from '@/assets/icons/arrow_icon.svg';
import headerWaveImg from '@/assets/image/header-wave.png';

// 타입 정의
type MenuItem = {
  to?: string;
  label: string;
  subItems?: { to: string; label: string }[];
};

// 상수 정의
const DESKTOP_MENU: MenuItem[] = [
  { to: '/map', label: '지도' },
  { to: '/explore/rankings', label: '혜택탐험' },
  { to: '/mypage/profile', label: '마이페이지' },
];

const MOBILE_MENU: MenuItem[] = [
  { to: '/map', label: '지도' },
  {
    label: '혜택탐험',
    subItems: [
      { to: '/explore/rankings', label: '혜택 순위' },
      { to: '/explore/share', label: '혜택 나누기' },
      { to: '/explore/membership', label: '멤버십 혜택' },
    ],
  },
  {
    label: '마이페이지',
    subItems: [
      { to: '/mypage/profile', label: '내 정보' },
      { to: '/mypage/collection', label: '혜택 도감' },
      { to: '/mypage/missions', label: '미션' },
      { to: '/mypage/statistics', label: '통계' },
      { to: '/mypage/favorites', label: '즐겨찾기' },
    ],
  },
  { to: '/login', label: '로그인' },
];

// 스타일 클래스 상수
const STYLES = {
  header: {
    base: 'z-100 fixed top-0 w-full h-[42px] md:h-[52px] px-6 md:px-12 flex items-end justify-between text-white',
    transparent: 'bg-transparent',
    default: 'bg-primaryGreen',
  },
  logo: 'text-xl md:text-[2rem] px-3 md:px-2 py-3 md:py-2 font-bold z-1000',
  desktopNav: 'text-xl hidden md:flex',
  desktopLogin:
    'p-[0.625rem] text-xl absolute right-[38px] top-[18px] hidden md:block transition-[background-color] duration-300 hover:bg-black/5 rounded-xl z-1000',
  mobileMenuButton: 'absolute right-6 top-0 p-3 cursor-pointer md:hidden',
  mobileMenuContainer: `
    transition-[max-height,padding-top,padding-bottom] duration-300 ease-in-out z-10
    overflow-hidden absolute top-[62px] left-0 w-full bg-white text-gray-500 shadow-md px-5 rounded-b-2xl
  `,
  activeMenuItem:
    'font-bold bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-lg text-[#1CB0F7]',
  headerWave:
    'absolute top-[42px] md:top-[52px] left-0 w-full h-5 md:h-[34px] z-100',
};

// 하위 컴포넌트들
const Logo = ({
  onMenuClose,
  isSignUpPage,
  isLoginPage,
}: {
  onMenuClose: () => void;
  isSignUpPage: boolean;
  isLoginPage: boolean;
}) => (
  <NavLink
    to="/"
    className={`${STYLES.logo} ${isSignUpPage ? 'text-primaryGreen' : ''} ${isLoginPage ? 'text-primaryGreen md:text-white' : ''}`}
    onClick={onMenuClose}
  >
    지중해
  </NavLink>
);

const DesktopNavigation = ({ isSignUpPage }: { isSignUpPage: boolean }) => {
  const location = useLocation();

  return (
    <nav className={STYLES.desktopNav}>
      {DESKTOP_MENU.map(({ to, label }) => {
        if (!to) return null;

        const isExplore = to.startsWith('/explore');
        const isActive =
          isExplore && location.pathname.startsWith('/explore')
            ? true
            : location.pathname === to;

        return (
          <NavLink
            key={to}
            to={to}
            className={`p-[0.625rem] z-1000 transition-[background-color] duration-300 hover:bg-black/5 rounded-xl ${isActive ? 'font-bold' : ''} ${isSignUpPage ? 'text-primaryGreen' : ''}`}
          >
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
};

const DesktopLogin = ({ isLoginPage }: { isLoginPage: boolean }) => (
  <NavLink
    to="/login"
    className={({ isActive }) =>
      `${STYLES.desktopLogin} ${isActive ? 'font-bold' : ''} ${isLoginPage ? 'text-primaryGreen' : ''}`
    }
  >
    로그인
  </NavLink>
);

const MobileMenuButton = ({
  isOpen,
  onClick,
  isSignUpPage,
  isLoginPage,
}: {
  isOpen: boolean;
  onClick: () => void;
  isSignUpPage: boolean;
  isLoginPage: boolean;
}) => (
  <button
    onClick={onClick}
    className={`${STYLES.mobileMenuButton} ${isSignUpPage || isLoginPage ? 'text-primaryGreen' : ''}`}
    aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
  >
    <img
      src={menuIcon}
      alt="메뉴"
      className={
        isSignUpPage || isLoginPage ? 'filter brightness-0 saturate-100' : ''
      }
      style={
        isSignUpPage || isLoginPage
          ? {
              filter:
                'invert(39%) sepia(85%) saturate(380%) hue-rotate(159deg) brightness(96%) contrast(89%)',
            }
          : {}
      }
    />
  </button>
);

const SubMenuItem = ({
  item,
  onClose,
}: {
  item: { to: string; label: string };
  onClose: () => void;
}) => (
  <NavLink
    key={item.to}
    to={item.to}
    onClick={onClose}
    className={({ isActive }) =>
      `py-1 pl-8 h-9 flex items-center ${isActive ? STYLES.activeMenuItem : ''}`
    }
  >
    {item.label}
  </NavLink>
);

const MenuItemWithSubItems = ({
  item,
  index,
  isSubOpen,
  toggleSubMenu,
  onClose,
}: {
  item: MenuItem;
  index: number;
  isSubOpen: boolean;
  toggleSubMenu: (index: number) => void;
  onClose: () => void;
}) => (
  <div className="flex flex-col">
    <button
      className="flex justify-between w-full px-4 py-2 text-left cursor-pointer h-10"
      onClick={() => toggleSubMenu(index)}
      aria-expanded={isSubOpen}
      aria-label={`${item.label} 메뉴 ${isSubOpen ? '접기' : '펼치기'}`}
    >
      <span>{item.label}</span>
      <img
        src={arrowIcon}
        alt="화살표 아이콘"
        className={`w-6 transition-transform duration-300 ${
          isSubOpen ? 'rotate-180' : ''
        }`}
      />
    </button>

    <div
      className={`
        overflow-hidden
        transition-[max-height] duration-300
        ${isSubOpen ? 'max-h-[400px]' : 'max-h-0'}
      `}
    >
      <div className="flex flex-col gap-[10px] py-1">
        {item.subItems?.map((subItem) => (
          <SubMenuItem key={subItem.to} item={subItem} onClose={onClose} />
        ))}
      </div>
    </div>
  </div>
);

const SimpleMenuItem = ({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) =>
  item.to && (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        `px-4 py-2 h-10 flex items-center ${
          isActive ? STYLES.activeMenuItem : ''
        }`
      }
    >
      {item.label}
    </NavLink>
  );

const MobileMenu = ({
  isOpen,
  isSubOpen,
  toggleSubMenu,
  onClose,
}: {
  isOpen: boolean;
  isSubOpen: boolean[];
  toggleSubMenu: (index: number) => void;
  onClose: () => void;
}) => (
  <div
    className={`
      ${STYLES.mobileMenuContainer}
      ${isOpen ? 'max-h-[700px] md:max-h-0' : 'max-h-0'}
    `}
  >
    <div className="w-full flex flex-col gap-3 py-5">
      {MOBILE_MENU.map((item, index) =>
        item.subItems ? (
          <MenuItemWithSubItems
            key={index}
            item={item}
            index={index}
            isSubOpen={isSubOpen[index]}
            toggleSubMenu={toggleSubMenu}
            onClose={onClose}
          />
        ) : (
          <SimpleMenuItem key={index} item={item} onClose={onClose} />
        ),
      )}
    </div>
  </div>
);

const HeaderWave = () => (
  <img src={headerWaveImg} alt="헤더" className={STYLES.headerWave} />
);

// 메인 컴포넌트
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isSubOpen, setIsSubOpen] = useState<boolean[]>(
    MOBILE_MENU.map(() => true),
  );

  const location = useLocation();

  // 페이지별 스타일 결정
  const isLandingPage = location.pathname === '/';
  const isSignUpPage = location.pathname === '/signup';
  const isLoginPage = location.pathname === '/login';
  const shouldShowWave = !isLoginPage && !isSignUpPage && !isLandingPage;
  const bgClass =
    isLandingPage || isLoginPage || isSignUpPage
      ? STYLES.header.transparent
      : STYLES.header.default;

  // 이벤트 핸들러
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);
  const handleSubMenuToggle = (index: number) => {
    setIsSubOpen((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };

  return (
    <>
      <header className={`${STYLES.header.base} ${bgClass}`}>
        {/* 왼쪽: 로고 + 데스크탑 메뉴 */}
        <div className="flex items-center absolute left-3 md:left-10 top-1 md:top-3 gap-2">
          <Logo
            onMenuClose={handleMenuClose}
            isSignUpPage={isSignUpPage}
            isLoginPage={isLoginPage}
          />
          <DesktopNavigation isSignUpPage={isSignUpPage} />
        </div>

        {/* 데스크탑 로그인 */}
        <DesktopLogin isLoginPage={isLoginPage} />

        {/* 모바일 메뉴 버튼 */}
        <MobileMenuButton
          isOpen={isMenuOpen}
          onClick={handleMenuToggle}
          isSignUpPage={isSignUpPage}
          isLoginPage={isLoginPage}
        />

        {/* 헤더 웨이브 이미지 */}
        {shouldShowWave && <HeaderWave />}
      </header>

      {/* 모바일 메뉴 */}
      <MobileMenu
        isOpen={isMenuOpen}
        isSubOpen={isSubOpen}
        toggleSubMenu={handleSubMenuToggle}
        onClose={handleMenuClose}
      />
    </>
  );
};

export default Header;
