import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LandingPage from './domains/Landing/pages/LandingPage';
import MapPage from './domains/Map/pages/MapPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './domains/Auth/pages/LoginPage';
import RankingPage from './domains/Explore/pages/RankingPage';
import SharePage from './domains/Explore/pages/SharePage';
import MembershipPage from './domains/Explore/pages/MembershipPage';
import ProfilePage from './domains/MyPage/pages/ProfilePage';
import CollectionPage from './domains/MyPage/pages/CollectionPage';
import MissionPage from './domains/MyPage/pages/MissionPage';
import StatisticsPage from './domains/MyPage/pages/StatisticsPage';
import FavoritesPage from './domains/MyPage/pages/FavoritesPage';

const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const SidebarLayout = () => {
  return (
    <>
      <Sidebar />
      <main className="mt-[62px] md:ml-[240px] flex justify-center md:mt-[86px]">
        <Outlet />
      </main>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 헤더 공통 적용 */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* 사이드바 레이아웃 포함 */}  
          <Route element={<SidebarLayout />}>
            <Route path="/explore/rankings" element={<RankingPage />} />
            <Route path="/explore/share" element={<SharePage />} />
            <Route path="/explore/membership" element={<MembershipPage />} />
            <Route path="/mypage/profile" element={<ProfilePage />} />
            <Route path="/mypage/collection" element={<CollectionPage />} />
            <Route path="/mypage/missions" element={<MissionPage />} />
            <Route path="/mypage/statistics" element={<StatisticsPage />} />
            <Route path="/mypage/favorites" element={<FavoritesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
