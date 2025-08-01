import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumb } from '@/components/Breadcrumb';
import {
  createBookmark,
  deleteBookmark,
  fetchBookmark,
  type StoreInfo,
} from '@/domains/Map/api/store';
import StoreCard from '@/domains/MyPage/components/favorites/StoreCard';
import dolphinFind from '@/assets/image/dolphin_find.png';

const CATEGORIES = [
  '음식점',
  '카페',
  '편의점',
  '대형마트',
  '문화시설',
  '렌터카',
] as const;

const FavoritesPage = () => {
  const [bookmark, setBookmark] = useState<StoreInfo[]>([]);
  const [toggledIds, setToggledIds] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredBookmark, setFilteredBookmark] = useState<StoreInfo[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 초기 북마크 데이터 로드
  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const response = await fetchBookmark();
        setBookmark(response);
      } catch (error) {
        console.error('북마크 데이터 로드 실패:', error);
      }
    };

    loadBookmarks();
  }, []);

  // 북마크 토글 처리
  const handleToggleBookmark = async (store: StoreInfo) => {
    const isToggled = toggledIds.has(store.id);

    try {
      if (isToggled) {
        await createBookmark(store.id);
        setToggledIds((prev) => {
          const next = new Set(prev);
          next.delete(store.id);
          return next;
        });
      } else {
        await deleteBookmark(store.id);
        setToggledIds((prev) => {
          const next = new Set(prev);
          next.add(store.id);
          return next;
        });
      }
    } catch (error) {
      console.error('즐겨찾기 토글 실패:', error);
    }
  };

  // 텍스트 정규화 (검색용)
  const normalizeText = (text: string) =>
    text.toLowerCase().replace(/\s+/g, '');

  // 북마크 필터링 로직
  useEffect(() => {
    let filtered = [...bookmark];

    // 카테고리 필터링
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (store) =>
          store.category && selectedCategories.includes(store.category),
      );
    }

    // 검색어 필터링
    if (searchKeyword.trim()) {
      const keywords = searchKeyword.toLowerCase().split(/\s+/).filter(Boolean);

      filtered = filtered.filter((store) => {
        const name = normalizeText(store.name || '');
        const brand = normalizeText(store.brandName || '');
        const address = normalizeText(store.address || '');

        return keywords.every(
          (keyword) =>
            name.includes(keyword) ||
            brand.includes(keyword) ||
            address.includes(keyword),
        );
      });
    }

    setFilteredBookmark(filtered);
  }, [bookmark, selectedCategories, searchKeyword]);

  // 카테고리 토글 처리
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? [] : [category],
    );
  };

  // 빈 상태 렌더링
  const renderEmptyState = () => {
    const isNoBookmarks = bookmark.length === 0;

    return (
      <div className="w-full flex flex-col items-center py-20">
        <img
          src={dolphinFind}
          alt="무언가를 찾는 돌고래 캐릭터"
          className="w-[150px] mb-4"
        />
        {isNoBookmarks ? (
          <>
            <p className="text-center mb-2">즐겨찾기 한 제휴처가 없어요</p>
            <p className="text-center">
              <Link to="/map" className="text-primaryGreen-80 font-bold">
                지도
              </Link>
              에서 즐겨찾기를 추가해보세요!
            </p>
          </>
        ) : (
          <>
            <p className="text-center mb-2">
              조건에 맞는 제휴처를 찾지 못했어요.
            </p>
            <p className="text-gray-500 text-center">
              검색어 또는 카테고리를 다시 확인해보세요.
            </p>
          </>
        )}
      </div>
    );
  };

  // 카테고리 버튼 렌더링
  const RenderCategoryButtons = () => (
    <div className="flex gap-1 mb-3  flex-wrap">
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            className={`h-[42px] px-3 py-2 rounded-full border cursor-pointer transition ${
              isSelected
                ? 'bg-primaryGreen text-white border-white hover:bg-[#5ea6b3]'
                : 'text-gray-700 border-gray-200 hover:bg-primaryGreen-40'
            }`}
            onClick={() => handleToggleCategory(category)}
          >
            {category}
          </button>
        );
      })}
    </div>
  );

  // 북마크 그리드 렌더링
  const renderBookmarkGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full break-keep">
      {filteredBookmark.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          isBookmark={!toggledIds.has(store.id)}
          toggleBookmark={handleToggleBookmark}
        />
      ))}
    </div>
  );

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
      <Breadcrumb title="마이페이지" subtitle="즐겨찾기" />

      <h1 className="text-[32px] font-bold my-3">즐겨찾기</h1>

      {/* 검색 입력 */}
      <input
        className="h-[54px] w-full border rounded-2xl px-4 py-1 border-gray-200 mb-3 focus:outline-none"
        placeholder="예시) GS25 강남"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />

      {/* 카테고리 필터 */}
      <RenderCategoryButtons />

      {/* 북마크 목록 또는 빈 상태 */}
      {filteredBookmark.length > 0 ? renderBookmarkGrid() : renderEmptyState()}
    </div>
  );
};

export default FavoritesPage;
