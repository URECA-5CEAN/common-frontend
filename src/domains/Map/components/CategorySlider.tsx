import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import clsx from 'clsx';

interface CategorySliderProps {
  Category: string[];
  isCategory: string;
  changeCategory: (cate: string) => void;
}

export default function CategorySlider({
  Category,
  isCategory,
  changeCategory,
}: CategorySliderProps) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'snap',
    slides: {
      perView: 'auto',
      spacing: 4,
    },
  });

  return (
    <div ref={sliderRef} className="keen-slider flex ">
      {Category.map((cate) => (
        <div key={cate} className="keen-slider__slide pr-20">
          <button
            className={clsx(
              'text-xs  px-4  py-1.5 w-20 text-center  rounded-2xl border-2 border-gray-200 cursor-pointer whitespace-nowrap',
              isCategory === cate
                ? 'text-primaryGreen bg-white'
                : 'bg-white hover:text-primaryGreen',
            )}
            onClick={() => changeCategory(cate)}
          >
            {cate}
          </button>
        </div>
      ))}
      <div className="keen-slider__slide pr-14" />
    </div>
  );
}
