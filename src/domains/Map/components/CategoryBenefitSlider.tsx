import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import clsx from 'clsx';
import type { CategoryIconMeta } from '../pages/MapPage';
import type { BenefitType, CategoryType } from '@/domains/Map/utils/constant';

// 통합 슬라이더 Props
interface CategoryBenefitSliderProps {
  categoryList: CategoryType[];
  selectedCategory: string;
  onCategoryChange: (cate: string) => void;
  categoryIconMap: Record<CategoryType, CategoryIconMeta>;
  benefitList: BenefitType[];
  selectedBenefit: BenefitType | '';
  onBenefitChange: (b: BenefitType | '') => void;
  benefitIconMap: Record<BenefitType, CategoryIconMeta>;
}

export default function CategoryBenefitSlider({
  categoryList,
  selectedCategory,
  onCategoryChange,
  categoryIconMap,
  benefitList,
  selectedBenefit,
  onBenefitChange,
  benefitIconMap,
}: CategoryBenefitSliderProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'snap',
    slides: {
      perView: 'auto',
      spacing: 4,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider flex md:hidden mb-2 pr-8 ">
      {/* 카테고리 */}
      {categoryList.map((cate, idx) => {
        const { icon: Icon, color, size, className } = categoryIconMap[cate];
        return (
          <div
            key={`category-${cate}-${idx}`}
            className="keen-slider__slide pr-24 md:hidden"
          >
            <button
              className={clsx(
                'text-xs px-2 py-1 gap-2 flex w-24 items-center justify-center rounded-2xl border-2 border-gray-200 cursor-pointer whitespace-nowrap',
                selectedCategory === cate
                  ? 'text-white bg-primaryGreen border-primaryGreen'
                  : 'bg-white hover:text-primaryGreen',
                'active:scale-[0.96]',
              )}
              onClick={() =>
                onCategoryChange(selectedCategory === cate ? '' : cate)
              }
            >
              <Icon
                size={size ?? 20}
                color={selectedCategory === cate ? '#fff' : (color ?? '#444')}
                className={clsx('shrink-0', className)}
              />
              {cate}
            </button>
          </div>
        );
      })}

      {/* 베네핏(혜택) */}
      {benefitList.map((benefit, idx) => {
        const { icon: Icon, color, size, className } = benefitIconMap[benefit];
        return (
          <div
            key={`benefit-${benefit}-${idx}`}
            className="keen-slider__slide pr-24 md:hidden"
          >
            <button
              className={clsx(
                'flex items-center justify-center gap-2 w-24 text-xs px-2 py-1 cursor-pointer rounded-2xl border-2 border-gray-200 transition-colors',
                selectedBenefit === benefit
                  ? 'text-white bg-amber-400 border-amber-400'
                  : 'bg-white hover:text-amber-500',
                'active:scale-[0.96]',
              )}
              onClick={() =>
                onBenefitChange(selectedBenefit === benefit ? '' : benefit)
              }
            >
              <Icon
                size={size ?? 18}
                color={selectedBenefit === benefit ? '#fff' : (color ?? '#444')}
                className={clsx('', className)}
              />
              <span className="truncate">{benefit}</span>
            </button>
          </div>
        );
      })}

      {/* 추가 여백 */}
      <div className="keen-slider__slide pr-8" />
    </div>
  );
}
