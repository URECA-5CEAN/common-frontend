import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import type {
  Post,
  SelectOption,
  TimeValue,
} from '@/domains/Explore/types/share';
import SharePostList from '@/domains/Explore/components/share/SharePostList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getBrands, getShareLocations, getSharePostList } from '../api/share';
import CustomSelect from '../components/CustomSelect';
import { Breadcrumb } from '@/components/Breadcrumb';
import { shortenProvince } from '../utils/addressUtils';

const SharePage = () => {
  const [postList, setPostList] = useState<Post[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);
  const [location, setLocation] = useState<SelectOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [category, setCategory] = useState<SelectOption | null>(null);

  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [brand, setBrand] = useState<SelectOption | null>(null);

  const [benefits, setBenefits] = useState<SelectOption[]>([]);
  const [benefit, setBenefit] = useState<SelectOption | null>(null);

  const [searchKeyword, setSearchKeyword] = useState('');

  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터에서 필터 값들을 복원하는 함수
  const restoreFiltersFromURL = useCallback(() => {
    const locationParam = searchParams.get('location');
    const categoryParam = searchParams.get('category');
    const brandParam = searchParams.get('brand');
    const benefitParam = searchParams.get('benefit');
    const searchParam = searchParams.get('search');
    const pageParam = searchParams.get('page');

    if (searchParam) {
      setSearchKeyword(searchParam);
    }

    if (pageParam) {
      setPage(parseInt(pageParam, 10) || 0);
    }

    return {
      locationParam,
      categoryParam,
      brandParam,
      benefitParam,
    };
  }, [searchParams]);

  // URL 파라미터를 업데이트
  const updateURLParams = (params: Record<string, string | null>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });

    setSearchParams(newSearchParams);
  };

  const fetchPostList = async (page: number, location?: string) => {
    try {
      const [currentPagePosts, nextPagePosts] = await Promise.all([
        getSharePostList(page, location),
        getSharePostList(page + 1, location),
      ]);

      setPostList((prev) => {
        const newIds = new Set(prev.map((p) => p.postId));
        const filteredNewPosts = currentPagePosts.filter(
          (p) => !newIds.has(p.postId),
        );
        return [...prev, ...filteredNewPosts];
      });

      setHasNextPage(nextPagePosts.length > 0);
    } catch (error) {
      console.error('게시글 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const locationsData = (await getShareLocations()).map((item) => ({
          label: shortenProvince(item),
          value: item,
        }));

        setLocations(locationsData);

        const { locationParam } = restoreFiltersFromURL();

        const initialLocation = locationParam
          ? locationsData.find((loc) => loc.value === locationParam) ||
            locationsData[0]
          : locationsData[0];

        setLocation(initialLocation);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    };

    fetchInitialData();
  }, [restoreFiltersFromURL]);

  useEffect(() => {
    if (!location) return;

    // 최초 또는 location 변경 시 초기 fetch
    setPostList([]);
    setPage(0);
    setHasNextPage(true);
    setIsLoading(true);
    fetchPostList(0, location.value);
  }, [location]);

  useEffect(() => {
    if (!location) return;

    const filtered = postList.filter(
      (post) => post.location === location.value,
    );

    const uniqueCategoryOptions: SelectOption[] = [
      ...new Set(filtered.map((post) => post.category)),
    ].map((category) => ({
      label: category,
      value: category,
    }));

    const uniqueBenefitOptions: SelectOption[] = [
      ...new Set(filtered.map((post) => post.benefitName)),
    ].map((benefitName) => ({
      label: benefitName,
      value: benefitName,
    }));

    setCategories(uniqueCategoryOptions);
    setBenefits(uniqueBenefitOptions);

    // URL 파라미터에서 필터 값 복원
    const { categoryParam, brandParam, benefitParam } = restoreFiltersFromURL();

    // 카테고리 복원
    if (categoryParam) {
      const restoredCategory = uniqueCategoryOptions.find(
        (cat) => cat.label === categoryParam,
      );
      if (restoredCategory) {
        setCategory(restoredCategory);
        // 브랜드도 함께 복원
        if (brandParam) {
          getBrands(categoryParam).then((res) => {
            const brandOptions = res.map(
              (item: { id: string; name: string }) => ({
                label: item.name,
                value: item.id,
              }),
            );
            setBrands(brandOptions);
            const restoredBrand = brandOptions.find(
              (b: SelectOption) => b.label === brandParam,
            );
            if (restoredBrand) {
              setBrand(restoredBrand);
            }
          });
        }
      }
    } else {
      setCategory(null);
      setBrand(null);
      setBrands([]);
    }

    // 혜택 복원
    if (benefitParam) {
      const restoredBenefit = uniqueBenefitOptions.find(
        (ben) => ben.label === benefitParam,
      );
      if (restoredBenefit) {
        setBenefit(restoredBenefit);
      }
    } else {
      setBenefit(null);
    }
  }, [location, postList, restoreFiltersFromURL]);

  const filteredPostList = useMemo(() => {
    return postList.filter((post) => {
      const matchLocation = location ? post.location === location.value : true;
      const matchCategory = category ? post.category === category.label : true;
      const matchBrand = brand ? post.brandName === brand.label : true;
      const matchBenefit = benefit ? post.benefitName === benefit.label : true;

      const matchSearch = searchKeyword
        ? post.title.includes(searchKeyword) ||
          post.content.includes(searchKeyword)
        : true;

      return (
        matchLocation &&
        matchCategory &&
        matchBrand &&
        matchBenefit &&
        matchSearch
      );
    });
  }, [postList, location, category, brand, benefit, searchKeyword]);

  const handleLocation = (value: SelectOption | TimeValue | null) => {
    const locationValue = value as SelectOption;
    setLocation(locationValue);

    updateURLParams({
      location: locationValue?.value || null,
      category: null,
      brand: null,
      benefit: null,
      search: searchKeyword || null,
      page: null,
    });
  };

  const handleCategory = async (value: SelectOption | TimeValue | null) => {
    const categoryValue = value as SelectOption;

    setCategory(categoryValue);
    setBrand(null);

    updateURLParams({
      location: location?.value || null,
      category: categoryValue?.label || null,
      brand: null,
      benefit: benefit?.label || null,
      search: searchKeyword || null,
      page: page > 0 ? page.toString() : null,
    });

    try {
      if (categoryValue) {
        const res = await getBrands(categoryValue.label);
        const brandOptions = res.map((item: { id: string; name: string }) => ({
          label: item.name,
          value: item.id,
        }));
        setBrands(brandOptions);
      } else {
        setBrands([]);
      }
    } catch (err) {
      console.error('브랜드 불러오기 실패', err);
      setBrands([]);
    }
  };

  const handleBrand = (value: SelectOption | TimeValue | null) => {
    const brandValue = value as SelectOption;
    setBrand(brandValue);

    updateURLParams({
      location: location?.value || null,
      category: category?.label || null,
      brand: brandValue?.label || null,
      benefit: benefit?.label || null,
      search: searchKeyword || null,
      page: page > 0 ? page.toString() : null,
    });
  };

  const handleBenefit = (value: SelectOption | TimeValue | null) => {
    const benefitValue = value as SelectOption;
    setBenefit(benefitValue);

    updateURLParams({
      location: location?.value || null,
      category: category?.label || null,
      brand: brand?.label || null,
      benefit: benefitValue?.label || null,
      search: searchKeyword || null,
      page: page > 0 ? page.toString() : null,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);

    updateURLParams({
      location: location?.value || null,
      category: category?.label || null,
      brand: brand?.label || null,
      benefit: benefit?.label || null,
      search: value || null,
      page: page > 0 ? page.toString() : null,
    });
  };

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
      <Breadcrumb title="혜택탐험" subtitle="혜택 나누기" />

      <h2 className="text-[32px] font-bold mt-3 mb-4">혜택 나누기</h2>

      <div className="flex justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <CustomSelect
            type="single"
            options={locations}
            onChange={handleLocation}
            value={location}
            icon={<MapPin size={20} strokeWidth={2} />}
          />

          <input
            type="text"
            className="flex-1 border rounded-2xl px-4 py-1 border-gray-200 focus:outline-none"
            placeholder="검색"
            value={searchKeyword}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="fixed right-4 bottom-4 sm:static sm:right-auto sm:bottom-auto sm:flex sm:items-center z-10">
          <Button
            variant="primary"
            size="lg"
            className="sm:flex whitespace-nowrap px-4 py-2 rounded-md items-center gap-1"
            onClick={() => navigate('/explore/share/write')}
          >
            <Plus size={18} />
            <span className="hidden sm:flex">글 작성</span>
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <CustomSelect
          type="single"
          options={categories}
          value={category}
          placeholder="카테고리"
          onChange={handleCategory}
        />

        <CustomSelect
          type="single"
          options={brands}
          value={brand}
          placeholder="브랜드"
          onChange={handleBrand}
          disabled={!category}
        />

        <CustomSelect
          type="single"
          options={benefits}
          value={benefit}
          placeholder="혜택 유형"
          onChange={handleBenefit}
        />
      </div>

      {isLoading ? (
        <div className="py-10 text-center text-gray-400">불러오는 중...</div>
      ) : (
        <>
          <SharePostList posts={filteredPostList} />
          {hasNextPage && (
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                onClick={() => {
                  const nextPage = page + 1;
                  setPage(nextPage);
                  fetchPostList(nextPage, location?.value);

                  updateURLParams({
                    location: location?.value || null,
                    category: category?.label || null,
                    brand: brand?.label || null,
                    benefit: benefit?.label || null,
                    search: searchKeyword || null,
                    page: nextPage.toString(),
                  });
                }}
              >
                더보기
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SharePage;
