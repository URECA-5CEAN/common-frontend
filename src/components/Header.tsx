import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import arrowIcon from '@/assets/icons/arrow_icon.svg';
import headerWaveImg from '@/assets/image/header-wave.svg';
import { useAuthStore } from '@/store/useAuthStore';
import { useUnsavedChanges } from '@/contexts/UnsavedChangesContext';
import { Menu, X } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

// 타입 정의
type MenuItem = {
  to?: string;
  label: string;
  subItems?: { to: string; label: string }[];
};

// 메뉴 데이터
const MENU_CONFIG = {
  desktop: {
    common: [
      { to: '/map', label: '지도' },
      { to: '/explore/reward', label: '혜택탐험' },
    ],
    loggedIn: [
      { to: '/mypage/profile', label: '마이페이지' },
      { to: '/chat', label: '채팅' },
    ],
  },
  mobile: {
    common: [
      { to: '/map', label: '지도' },
      {
        label: '혜택탐험',
        subItems: [
          { to: '/explore/reward', label: '기프티콘' },
          { to: '/explore/rankings', label: '혜택 순위' },
          { to: '/explore/share', label: '혜택 나누기' },
        ],
      },
    ],
    loggedIn: [
      {
        label: '마이페이지',
        subItems: [
          { to: '/mypage/profile', label: '내 정보' },
          { to: '/mypage/collection', label: '혜택 도감' },
          { to: '/mypage/missions', label: '미션' },
          { to: '/mypage/statistics', label: '통계' },
          { to: '/mypage/favorites', label: '즐겨찾기' },
          { to: '/mypage/share', label: '내 나눔' },
        ],
      },
      { to: '/chat', label: '채팅' },
    ],
    notLoggedIn: [{ to: '/login', label: '로그인' }],
  },
};

// 스타일 상수
const STYLES = {
  header: {
    base: 'z-1000 fixed top-0 w-full h-[48px] md:h-[48px] py-2 px-6 md:px-10 flex items-end justify-between text-white',
    transparent: 'bg-transparent',
    default: 'bg-primaryGreen',
  },
  logo: 'text-xl md:text-2xl px-3 md:px-2 py-3 md:py-2 font-bold z-1000 cursor-pointer',
  desktopNav: 'text-lg hidden md:flex',
  desktopLogin:
    'py-[7px] px-3 text-lg absolute right-[38px] top-2 hidden md:block transition-[background-color] duration-100 hover:bg-black/5 rounded-xl z-1000 cursor-pointer',
  mobileMenuButton:
    'absolute right-6 top-[-4px] right-[8px] p-3 cursor-pointer md:hidden',
  mobileMenuContainer: `
    transition-[max-height,padding-top,padding-bottom] duration-300 ease-in-out z-100
    overflow-hidden fixed top-0 left-0 w-full bg-white text-gray-500 shadow-md rounded-b-2xl
  `,
  // 외부 클릭 감지를 위한 오버레이 스타일 추가
  mobileMenuOverlay: 'fixed inset-0 z-50 md:hidden',
  activeMenuItem:
    'font-bold bg-[#DDF4FF] border-2 border-[#84D8FF] rounded-lg text-[#1CB0F7]',
  headerWave:
    'absolute top-[40px] md:top-[50px] w-full min-w-[1150px] left-0 h-5 md:h-[34px] z-200',
};

// 유틸리티 함수
const getPageStyles = (pathname: string) => {
  const isLandingPage = pathname === '/';
  const isSignUpPage = pathname === '/signup';
  const isLoginPage = pathname === '/login';

  return {
    isLandingPage,
    isSignUpPage,
    isLoginPage,
    shouldShowWave: !isLoginPage && !isSignUpPage && !isLandingPage,
    bgClass:
      isLandingPage || isLoginPage || isSignUpPage
        ? STYLES.header.transparent
        : STYLES.header.default,
  };
};

const getMenuItems = (isLoggedIn: boolean) => {
  const desktop = [
    ...MENU_CONFIG.desktop.common,
    ...(isLoggedIn ? MENU_CONFIG.desktop.loggedIn : []),
  ];

  const mobile = [
    ...MENU_CONFIG.mobile.common,
    ...(isLoggedIn
      ? MENU_CONFIG.mobile.loggedIn
      : MENU_CONFIG.mobile.notLoggedIn),
  ];

  return { desktop, mobile };
};

// 컴포넌트들
const Logo = ({
  onMenuClose,
  isSignUpPage,
  isLoginPage,
  isLandingPage,
  isOpen,
}: {
  onMenuClose: () => void;
  isSignUpPage: boolean;
  isLoginPage: boolean;
  isLandingPage: boolean;
  isOpen: boolean;
}) => {
  const { handleProtectedNavigation } = useUnsavedChanges();

  const textColorClass = isSignUpPage
    ? 'text-primaryGreen'
    : isLoginPage
      ? 'text-primaryGreen md:text-white'
      : isLandingPage && isOpen
        ? 'text-primaryGreen'
        : 'text-white';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onMenuClose();
    handleProtectedNavigation('/');
  };

  return (
    <button
      className={`${STYLES.logo} ${textColorClass}`}
      onClick={handleClick}
    >
      지중해
    </button>
  );
};

const DesktopNavigation = ({
  isSignUpPage,
  menu,
}: {
  isSignUpPage: boolean;
  menu: MenuItem[];
}) => {
  const location = useLocation();
  const { handleProtectedNavigation } = useUnsavedChanges();

  const isMenuItemActive = (to: string) => {
    if (to.startsWith('/explore')) {
      return location.pathname.startsWith('/explore');
    }
    return location.pathname === to;
  };

  const handleClick = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleProtectedNavigation(to);
  };

  return (
    <nav className={STYLES.desktopNav}>
      {menu.map(({ to, label }) => {
        if (!to) return null;

        const isActive = isMenuItemActive(to);
        const textColorClass = isSignUpPage ? 'text-primaryGreen' : '';

        return (
          <NavLink
            key={to}
            to={to}
            onClick={handleClick(to)}
            className={`py-[7px] px-3 z-1000 transition-[background-color] duration-100 hover:bg-black/5 rounded-xl ${isActive ? 'font-bold' : ''} ${textColorClass}`}
          >
            {label}
          </NavLink>
        );
      })}
    </nav>
  );
};

const DesktopAuth = ({
  isLoginPage,
  isLoggedIn,
  onLogout,
}: {
  isLoginPage: boolean;
  isLoggedIn: boolean;
  onLogout: () => void;
}) => {
  const { handleProtectedNavigation } = useUnsavedChanges();
  const textColorClass = isLoginPage ? 'text-primaryGreen' : '';

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleProtectedNavigation('/login');
  };

  if (isLoggedIn) {
    return (
      <button
        className={`${STYLES.desktopLogin} ${textColorClass}`}
        onClick={onLogout}
      >
        로그아웃
      </button>
    );
  }

  return (
    <button
      onClick={handleLoginClick}
      className={`${STYLES.desktopLogin} ${textColorClass}`}
    >
      로그인
    </button>
  );
};

const MobileMenuButton = ({
  isOpen,
  onClick,
  isSignUpPage,
  isLoginPage,
  isLandingPage,
  buttonRef,
}: {
  isOpen: boolean;
  onClick: () => void;
  isSignUpPage: boolean;
  isLoginPage: boolean;
  isLandingPage: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) => {
  const shouldApplyFilter = isSignUpPage || isLoginPage;
  const textColorClass = shouldApplyFilter
    ? '#6fc3d1'
    : isLandingPage && isOpen
      ? '#6fc3d1'
      : '#ffffff';

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`${STYLES.mobileMenuButton} ${textColorClass}`}
      aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
    >
      {isOpen ? (
        <X size={30} color={textColorClass} />
      ) : (
        <Menu size={30} color={textColorClass} />
      )}
    </button>
  );
};

const SubMenuItem = ({
  item,
  onClose,
}: {
  item: { to: string; label: string };
  onClose: () => void;
}) => {
  const location = useLocation();
  const { handleProtectedNavigation } = useUnsavedChanges();
  const isActive = location.pathname.startsWith(item.to);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    handleProtectedNavigation(item.to);
  };
  return (
    <button
      onClick={handleClick}
      className={`py-1 pl-8 h-9 flex items-center ${isActive ? STYLES.activeMenuItem : ''}`}
    >
      {item.label}
    </button>
  );
};

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
        className={`w-6 transition-transform duration-100 ${isSubOpen ? 'rotate-180' : ''}`}
      />
    </button>

    <div
      className={`overflow-hidden transition-[max-height] duration-100 ${isSubOpen ? 'max-h-[400px]' : 'max-h-0'}`}
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
}) => {
  const location = useLocation();
  const { handleProtectedNavigation } = useUnsavedChanges();

  if (!item.to) return null;

  const isActive = location.pathname.startsWith(item.to);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    if (item.to) {
      handleProtectedNavigation(item.to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 h-10 flex items-center ${isActive ? STYLES.activeMenuItem : ''}`}
    >
      {item.label}
    </button>
  );
};

// 수정된 MobileMenu 컴포넌트 - ref 타입 수정
const MobileMenu = ({
  isOpen,
  isSubOpen,
  toggleSubMenu,
  onClose,
  menu,
  isLoggedIn,
  onLogout,
  menuRef,
}: {
  isOpen: boolean;
  isSubOpen: boolean[];
  toggleSubMenu: (index: number) => void;
  onClose: () => void;
  menu: MenuItem[];
  isLoggedIn: boolean;
  onLogout: () => void;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) => (
  <div
    ref={menuRef}
    className={`${STYLES.mobileMenuContainer} ${isOpen ? 'max-h-[calc(100vh+22px)] md:max-h-0' : 'max-h-0'}`}
  >
    <div className="w-full flex flex-col gap-3 pl-5 pr-2 pb-5 mt-[62px] h-full max-h-[calc(100vh-102px)] overflow-y-auto">
      {menu.map((item, index) =>
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

      {isLoggedIn && (
        <button
          className="px-4 py-2 h-10 flex items-center cursor-pointer"
          onClick={onLogout}
        >
          로그아웃
        </button>
      )}
    </div>
  </div>
);

const HeaderWave = () => (
  <>
    <div className="absolute top-[40px] md:top-[34px] w-full min-w-[1150px] left-0 h-5 md:h-[34px] z-200 flex">
      <img src={headerWaveImg} alt="헤더" className="hidden md:block" />
      <img src={headerWaveImg} alt="헤더" className="hidden md:block" />
    </div>
  </>
);

// 메인 컴포넌트 - ref 타입 수정
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout } = useAuthStore();
  const location = useLocation();

  // ref 타입을 명시적으로 지정
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // 메뉴 아이템 계산
  const menuItems = useMemo(() => getMenuItems(isLoggedIn), [isLoggedIn]);

  // 서브메뉴 상태 초기화
  const [isSubOpen, setIsSubOpen] = useState<boolean[]>(() =>
    menuItems.mobile.map(() => true),
  );

  // 페이지 스타일 계산
  const pageStyles = useMemo(
    () => getPageStyles(location.pathname),
    [location.pathname],
  );

  // 외부 클릭 감지 useEffect 수정
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;

      // 메뉴가 열려있고, 클릭한 곳이 메뉴나 햄버거 버튼이 아닌 경우
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        menuButtonRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    // 모바일에서만 이벤트 리스너 추가 (md 이하)
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    if (isMenuOpen && mediaQuery.matches) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 이벤트 핸들러
  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);
  const handleSubMenuToggle = (index: number) => {
    setIsSubOpen((prev) => prev.map((open, i) => (i === index ? !open : open)));
  };
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/map');
  };
  const handleLogoutClick = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className={`${STYLES.header.base} ${pageStyles.bgClass}`}>
        {/* 로고 + 데스크탑 네비게이션 */}
        <div className="flex items-center absolute left-3 md:left-10 top-[-2px] md:top-1 gap-2">
          <Logo
            onMenuClose={handleMenuClose}
            isSignUpPage={pageStyles.isSignUpPage}
            isLoginPage={pageStyles.isLoginPage}
            isLandingPage={pageStyles.isLandingPage}
            isOpen={isMenuOpen}
          />
          <DesktopNavigation
            isSignUpPage={pageStyles.isSignUpPage}
            menu={menuItems.desktop}
          />
        </div>

        {/* 데스크탑 인증 */}
        <DesktopAuth
          isLoginPage={pageStyles.isLoginPage}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogoutClick}
        />

        {/* 모바일 메뉴 버튼 - ref를 prop으로 전달 */}
        <MobileMenuButton
          isOpen={isMenuOpen}
          onClick={handleMenuToggle}
          isSignUpPage={pageStyles.isSignUpPage}
          isLoginPage={pageStyles.isLoginPage}
          buttonRef={menuButtonRef}
          isLandingPage={pageStyles.isLandingPage}
        />

        {/* 헤더 웨이브 */}
        {pageStyles.shouldShowWave && <HeaderWave />}
      </header>

      {/* 모바일 메뉴 */}
      <MobileMenu
        isOpen={isMenuOpen}
        isSubOpen={isSubOpen}
        toggleSubMenu={handleSubMenuToggle}
        onClose={handleMenuClose}
        menu={menuItems.mobile}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogoutClick}
        menuRef={mobileMenuRef}
      />

      <Modal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="로그아웃"
        description="정말 로그아웃 하시겠어요?"
        actions={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsAuthModalOpen(false)}
            >
              취소
            </Button>
            <Button
              fullWidth
              onClick={() => {
                handleLogout();
                setIsAuthModalOpen(false);
              }}
            >
              로그아웃
            </Button>
          </>
        }
      />
    </>
  );
};

export default Header;
