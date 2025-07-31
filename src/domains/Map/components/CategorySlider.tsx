import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import clsx from 'clsx';
import type { CategoryIconMeta } from '../pages/MapPage';

export interface CategoryProps {
  Category: string[];
  isCategory: string;
  changeCategory: (cate: string) => void;
  categoryIconMap: Record<string, CategoryIconMeta>;
}

export default function CategorySlider({
  Category,
  isCategory,
  changeCategory,
  categoryIconMap,
}: CategoryProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'snap',
    slides: {
      perView: 'auto',
      spacing: 2,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider flex">
      {Category.map((cate) => {
        const { icon: Icon, color, size, className } = categoryIconMap[cate];
        return (
          <div key={cate} className=" keen-slider__slide pr-24 md:hidden">
            <button
              className={clsx(
                'text-xs px-4 py-1.5 gap-2 flex w-24  items-center justify-center rounded-2xl border-2 border-gray-200 cursor-pointer whitespace-nowrap',
                isCategory === cate
                  ? 'text-black bg-primaryGreen border-primaryGreen '
                  : 'bg-white hover:text-primaryGreen',
              )}
              onClick={() => changeCategory(cate)}
            >
              <Icon
                size={size ?? 20}
                color={color ?? '#444'}
                className={clsx('shrink-0', className)}
              />
              {cate}
            </button>
          </div>
        );
      })}
      <div className="keen-slider__slide pr-14" />
    </div>
  );
}
