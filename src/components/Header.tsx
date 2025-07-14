import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login';
  const bgClass =
    isLandingPage || isAuthPage ? 'bg-transparent' : 'bg-primaryGreen';

  const navigate = useNavigate();

  return (
    <header
      className={`fixed top-0 w-full h-[86px] px-[3rem] flex items-center gap-auto ${bgClass}`}
    >
      <div className="flex items-center">
        <NavLink to="/" className="text-[2rem] p-[0.625rem] font-bold">
          지중해
        </NavLink>
        {!isAuthPage && (
          <div className="flex text-xl">
            <NavLink
              to="/map"
              className={({ isActive }) =>
                `p-[0.625rem] ${isActive ? 'font-bold' : ''}`
              }
            >
              지도
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `p-[0.625rem] ${isActive ? 'font-bold' : ''}`
              }
            >
              혜택탐험
            </NavLink>
            <NavLink
              to="/mypage"
              className={({ isActive }) =>
                `p-[0.625rem] ${isActive ? 'font-bold' : ''}`
              }
            >
              마이페이지
            </NavLink>
          </div>
        )}
      </div>
      {isAuthPage ? (
        <button onClick={() => navigate(-1)} className="p-[0.625rem] ml-auto">
          닫기
        </button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `p-[0.625rem] text-xl ml-auto ${isActive ? 'font-bold' : ''}`
          }
        >
          로그인
        </NavLink>
      )}
    </header>
  );
};

export default Header;
