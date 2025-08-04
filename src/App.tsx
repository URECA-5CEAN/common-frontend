import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';
import LandingPage from './domains/Landing/pages/LandingPage';
import MapPage from './domains/Map/pages/MapPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './domains/Auth/pages/LoginPage';
import SignUpPage from './domains/Auth/pages/SignUpPage';
import RankingPage from './domains/Explore/pages/RankingPage';
import SharePage from './domains/Explore/pages/SharePage';
import ShareWritePage from './domains/Explore/pages/ShareWritePage';
import ShareDetailPage from './domains/Explore/pages/ShareDetailPage';
import ProfilePage from './domains/MyPage/pages/ProfilePage';
import CollectionPage from './domains/MyPage/pages/CollectionPage';
import MissionPage from './domains/MyPage/pages/MissionPage';
import StatisticsPage from './domains/MyPage/pages/StatisticsPage';
import FavoritesPage from './domains/MyPage/pages/FavoritesPage';
import EditProfilePage from '@/domains/MyPage/pages/EditProfilePage';
import MySharePage from '@/domains/MyPage/pages/MySharePage';
import { useAuthStore } from '@/store/useAuthStore';
import LeaveConfirmModal from '@/components/LeaveConfirmModal';
import { UnsavedChangesProvider } from '@/contexts/UnsavedChangesContext';
import MyShareDetailPage from '@/domains/MyPage/pages/MyShareDetailPage';
import MyShareEditPage from '@/domains/MyPage/pages/MyShareEditPage';
import ChatPage from '@/domains/Chat/pages/ChatPage';
import MyPageWritePage from '@/domains/MyPage/pages/MyPageWritePage';
import ShareEditPage from '@/domains/Explore/pages/ShareEditPage';
import dolphinError from '@/assets/image/dolphin-error.svg';

import { Toaster } from 'react-hot-toast';
import ScrollToTop from '@/domains/Auth/components/ScrollToTop';
import RewardPage from '@/domains/MyPage/pages/RewardPage';

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
      <main className="mt-[82px] md:mt-[118px] md:ml-[240px] flex justify-center ">
        <Outlet />
      </main>
    </>
  );
};

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen m-6 text-center break-keep">
      <img src={dolphinError} alt="돌고래" className="w-40 mb-5" />
      <h1 className="text-xl md:text-2xl font-bold mb-4">
        404 - 페이지를 찾을 수 없습니다.
      </h1>
      <p>요청하신 페이지가 존재하지 않거나 잘못된 경로입니다.</p>
      <a href="/" className="mt-6 text-blue-600 underline">
        홈으로 돌아가기
      </a>
    </div>
  );
};

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    // 로그인 안 된 경우 /mypage 같은 경로 접근 시 지도 페이지로 이동
    return <Navigate to="/map" replace />;
  }

  // 로그인 됐으면 자식 라우트 렌더링
  return <Outlet />;
};

export const PublicRoute = () => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    // 로그인 되어있는데 /login 같은 경로 접근 시
    return <Navigate to="/map" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster position="bottom-center" reverseOrder={false} />
      <UnsavedChangesProvider>
        <Routes>
          <Route element={<AppLayout />}>
            {/* 로그인 안 된 사람도 접근 가능한 기본 페이지들 */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/map" element={<MapPage />} />

            {/* 로그인 되어 있으면 못 가도록 설정 (로그인/회원가입) */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
            </Route>

            {/* 인증 필요 없는 explore 메뉴 */}
            <Route element={<SidebarLayout />}>
              <Route path="/explore/reward" element={<RewardPage />} />
              <Route path="/explore/rankings" element={<RankingPage />} />
              <Route path="/explore/share" element={<SharePage />} />
              <Route
                path="/explore/share/:postId"
                element={<ShareDetailPage />}
              />
            </Route>

            {/* 로그인 필요 */}
            <Route element={<ProtectedRoute />}>
              <Route path="/chat" element={<ChatPage />} />
            </Route>

            {/* 로그인 필요 */}
            <Route element={<ProtectedRoute />}>
              <Route element={<SidebarLayout />}>
                <Route
                  path="/explore/share/write"
                  element={<ShareWritePage />}
                />
                <Route
                  path="/explore/share/edit/:postId"
                  element={<ShareEditPage />}
                />

                <Route path="/mypage/profile" element={<ProfilePage />} />
                <Route
                  path="/mypage/profile/edit"
                  element={<EditProfilePage />}
                />
                <Route path="/mypage/collection" element={<CollectionPage />} />
                <Route path="/mypage/missions" element={<MissionPage />} />
                <Route path="/mypage/statistics" element={<StatisticsPage />} />
                <Route path="/mypage/favorites" element={<FavoritesPage />} />
                <Route path="/mypage/share" element={<MySharePage />} />
                <Route
                  path="/mypage/share/:postId"
                  element={<MyShareDetailPage />}
                />
                <Route
                  path="/mypage/share/edit/:postId"
                  element={<MyShareEditPage />}
                />
                <Route
                  path="/mypage/share/write"
                  element={<MyPageWritePage />}
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <LeaveConfirmModal />
      </UnsavedChangesProvider>
    </BrowserRouter>
  );
}

export default App;
