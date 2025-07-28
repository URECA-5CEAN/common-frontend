// components/CategoryAndBrandSelector.tsx
import { useEffect, useState } from 'react';
import type { SelectOption, TimeValue } from '../../types/share';
import { getBenefitType, getBrands, getCategories } from '../../api/share';
import { benefitTypeMap } from '../../constants/share';
import CustomSelect from '../CustomSelect';

interface CategoryAndBrandSelectorProps {
  selectedCategory: SelectOption | null;
  setSelectedCategory: (option: SelectOption | null) => void;
  selectedBrand: SelectOption | null;
  setSelectedBrand: (option: SelectOption | null) => void;
  selectedBenefitType: SelectOption | null;
  setSelectedBenefitType: (option: SelectOption | null) => void;
}

const SelectFields = ({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  selectedBenefitType,
  setSelectedBenefitType,
}: CategoryAndBrandSelectorProps) => {
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [brands, setBrands] = useState<SelectOption[]>([]);
  const [benefitTypes, setBenefitTypes] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false); // 내부 로딩 상태

  // 카테고리 불러오기
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const res: string[] = await getCategories();
        const categoryOptions: SelectOption[] = res.map((item) => ({
          label: item,
          value: item,
        }));
        setCategories(categoryOptions);
      } catch (e) {
        console.error('카테고리 불러오기 실패', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (
    value: SelectOption | TimeValue | null,
  ) => {
    const category = value as SelectOption;
    setSelectedCategory(category);
    setSelectedBrand(null);
    setSelectedBenefitType(null);
    setBenefitTypes([]);

    setIsLoading(true);
    try {
      const res = await getBrands(category.value);
      const brandOptions = res.map((item: { id: string; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
      setBrands(brandOptions);
    } catch (err) {
      console.error('브랜드 불러오기 실패', err);
      setBrands([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandChange = async (value: SelectOption | TimeValue | null) => {
    const brand = value as SelectOption;
    setSelectedBrand(brand);
    setSelectedBenefitType(null); // 브랜드 변경 시 혜택 유형 초기화

    setIsLoading(true);
    try {
      const res = await getBenefitType(brand.value);
      const uniqueMap = new Map<string, SelectOption>();

      res.forEach((item: { id: string; category: string }) => {
        const label = benefitTypeMap[item.category] ?? item.category;
        if (!uniqueMap.has(label)) {
          uniqueMap.set(label, {
            label,
            value: item.id,
          });
        }
      });
      const benefitTypes = Array.from(uniqueMap.values());
      setBenefitTypes(benefitTypes);
    } catch (err) {
      console.error('혜택 유형 불러오기 실패', err);
      setBenefitTypes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBenefitTypeChange = (value: SelectOption | TimeValue | null) => {
    setSelectedBenefitType(value as SelectOption);
  };

  return (
    <div className="flex gap-2 mb-4 flex-wrap">
      <CustomSelect
        type="single"
        value={selectedCategory}
        options={categories}
        onChange={handleCategoryChange}
        placeholder="카테고리"
        disabled={isLoading}
      />
      <CustomSelect
        type="single"
        value={selectedBrand}
        options={brands}
        onChange={handleBrandChange}
        placeholder="브랜드"
        disabled={!selectedCategory || isLoading}
      />
      <CustomSelect
        type="single"
        value={selectedBenefitType}
        options={benefitTypes}
        onChange={handleBenefitTypeChange}
        placeholder="혜택 유형"
        disabled={!selectedBrand || isLoading}
      />
    </div>
  );
};

export default SelectFields;
