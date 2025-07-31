import clsx from 'clsx';
import type { CategoryProps } from './CategorySlider';

export default function DeskTopBtns({
  Category,
  isCategory,
  changeCategory,
  categoryIconMap,
}: CategoryProps) {
  return (
    <div className="md:flex justify-start space-x-2 hidden">
      {Category.map((cate) => {
        const { icon: Icon, color, size, className } = categoryIconMap[cate];

        return (
          <button
            key={cate}
            className={clsx(
              'flex items-center justify-center gap-2 w-[100px] text-sm px-2 py-1  cursor-pointer rounded-2xl border-2 border-gray-200 transition-colors',
              isCategory === cate
                ? 'text-black bg-primaryGreen border-primaryGreen '
                : 'bg-white hover:text-primaryGreen',
            )}
            onClick={() => changeCategory(cate)}
          >
            <Icon
              size={size ?? 18}
              color={color ?? '#444'}
              className={clsx('', className)}
            />
            <span className="truncate">{cate}</span>
          </button>
        );
      })}
    </div>
  );
}
