import type { CategoryIconMeta } from '@/domains/Map/pages/MapPage';
import clsx from 'clsx';

interface CategoryProps {
  Category: string[];
  isCategory: string;
  changeCategory: (cate: string) => void;
  categoryIconMap: Record<string, CategoryIconMeta>;
}

export default function DeskTopBtns({
  Category,
  isCategory,
  changeCategory,
  categoryIconMap,
}: CategoryProps) {
  return (
    <div className="md:flex justify-start space-x-2 hidden overflow-visible">
      {Category.map((cate, idx) => {
        const { icon: Icon, color, size, className } = categoryIconMap[cate];

        return (
          <button
            key={`${cate}-${idx}`}
            className={clsx(
              'flex items-center justify-center gap-2 w-[100px] text-sm px-2 py-1.5 cursor-pointer rounded-2xl transition-colors',
              isCategory === cate
                ? 'text-white bg-primaryGreen hover:bg-primaryGreen-80'
                : 'bg-white hover:text-primaryGreen',
              'active:scale-[0.96] ',
            )}
            style={{ boxShadow: '0 3px 3px rgba(0,0,0,0.2)' }}
            onClick={() => changeCategory(cate)}
          >
            <Icon
              size={size ?? 18}
              color={isCategory === cate ? '#fff' : (color ?? '#444')}
              className={clsx('', className)}
            />
            <span className="truncate">{cate}</span>
          </button>
        );
      })}
    </div>
  );
}
