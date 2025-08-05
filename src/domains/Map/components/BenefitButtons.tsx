import clsx from 'clsx';
import type { CategoryIconMeta } from '../pages/MapPage';
import type { BenefitType } from '@/domains/Map/utils/constant';

interface BenefitButtonProps {
  benefitList: BenefitType[];
  selected: BenefitType | '';
  onSelect: (benefit: BenefitType | '') => void;
  benefitIconMap: Record<BenefitType, CategoryIconMeta>;
}

export default function BenefitButton({
  benefitList,
  selected,
  onSelect,
  benefitIconMap,
}: BenefitButtonProps) {
  return (
    <div className="md:flex justify-start space-x-2 hidden ">
      {benefitList.map((benefit, idx) => {
        const { icon: Icon, color, size, className } = benefitIconMap[benefit];

        return (
          <button
            key={`${benefit}-${idx}`}
            className={clsx(
              'flex items-center justify-center gap-2 w-[100px] text-sm px-4 py-1.5  cursor-pointer rounded-2xl transition-colors',
              selected === benefit
                ? 'text-white bg-amber-400 hover:bg-amber-500'
                : 'bg-white hover:text-amber-500',
              'active:scale-[0.96] ',
            )}
            style={{ boxShadow: '0 3px 3px rgba(0,0,0,0.2)' }}
            onClick={() => onSelect(selected === benefit ? '' : benefit)}
          >
            <Icon
              size={size ?? 18}
              color={selected === benefit ? '#fff' : (color ?? '#444')}
              className={clsx('', className)}
            />
            <span className="truncate">{benefit}</span>
          </button>
        );
      })}
    </div>
  );
}
