import clsx from 'clsx';
import type { CategoryProps } from './CategorySlider';

export default function DeskTopBtns({
  Category,
  isCategory,
  changeCategory,
}: CategoryProps) {
  return (
    <div className="md:flex justify-start space-x-2 hidden">
      {Category.map((cate) => (
        <button
          key={cate}
          className={clsx(
            ' text-xs px-6 hover:text-primaryGreen py-1.5 w-24 cursor-pointer rounded-2xl border-2 border-gray-200',
            isCategory === cate ? 'text-primaryGreen bg-white' : 'bg-white',
          )}
          onClick={() => changeCategory(cate)}
        >
          {cate}
        </button>
      ))}
    </div>
  );
}
