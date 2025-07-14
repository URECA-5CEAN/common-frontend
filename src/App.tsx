import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import MapPage from './MapPage';
import ExplorePage from './ExplorePage';
import MyPage from './MyPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

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
    <div className="flex">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
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
