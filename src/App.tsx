import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LandingPage from './domains/Landing/pages/LandingPage';
import MapPage from './domains/Map/pages/MapPage';
import ExplorePage from './domains/Explore/pages/ExplorePage';
import MyPage from './domains/MyPage/pages/MyPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './domains/Auth/pages/LoginPage';

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
      <main className="mt-[86px] ml-[240px] flex justify-center">
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
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/mypage" element={<MyPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
