import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import type {
  Post,
  SelectOption,
  TimeValue,
} from '@/domains/Explore/types/share';
import SharePostList from '@/domains/Explore/components/share/SharePostList';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { getBrands, getShareLocations, getSharePostList } from '../api/share';
import CustomSelect from '../components/CustomSelect';

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

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const postListData = await getSharePostList();
        const locationsData = (await getShareLocations()).map((item) => ({
          label: item,
          value: item,
        }));

        setPostList(postListData);
        setLocations(locationsData);
        setLocation(locationsData[0] || null);
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

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
    setCategory(null);
    setBrand(null);
    setBrands([]);
    setBenefit(null);
  }, [location, postList]);

  const filteredPostList = useMemo(() => {
    return postList.filter((post) => {
      const matchLocation = location ? post.location === location.label : true;
      const matchCategory = category ? post.category === category.label : true;
      const matchBrand = brand ? post.brandName === brand.label : true;
      const matchBenefit = benefit ? post.benefitName === benefit.label : true;
      return matchLocation && matchCategory && matchBrand && matchBenefit;
    });
  }, [postList, location, category, brand, benefit]);

  const handleLocation = (value: SelectOption | TimeValue | null) => {
    setLocation(value as SelectOption);
  };

  const handleCategory = async (value: SelectOption | TimeValue | null) => {
    const categoryValue = value as SelectOption;

    setCategory(categoryValue);
    setBrand(null);

    try {
      const res = await getBrands(categoryValue.label);
      const brandOptions = res.map((item: { id: string; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
      setBrands(brandOptions);
    } catch (err) {
      console.error('브랜드 불러오기 실패', err);
      setBrands([]);
    }
  };

  const handleBrand = (value: SelectOption | TimeValue | null) => {
    setBrand(value as SelectOption);
  };

  const handleBenefit = (value: SelectOption | TimeValue | null) => {
    setBenefit(value as SelectOption);
  };

  return (
    <div className="w-full max-w-[1050px] m-6">
      <h2 className="text-[32px] font-bold mb-4">혜택 나누기</h2>

      <div className="flex justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <CustomSelect
            type="single"
            options={locations}
            onChange={handleLocation}
            value={location}
          />

          <input
            type="text"
            className="flex-1 border rounded-2xl px-4 py-1 border-gray-200"
            placeholder="검색"
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

      <div className="flex gap-2 mt-4">
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
        <SharePostList posts={filteredPostList} />
      )}
    </div>
  );
};

export default SharePage;
