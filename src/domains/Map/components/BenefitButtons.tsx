import clsx from 'clsx';
import type { BenefitType, CategoryIconMeta } from '../pages/MapPage';

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
    <div className="md:flex justify-start space-x-2 hidden">
      {benefitList.map((benefit, idx) => {
        const { icon: Icon, color, size, className } = benefitIconMap[benefit];

        return (
          <button
            key={`${benefit}-${idx}`}
            className={clsx(
              'flex items-center justify-center gap-2 w-[100px] text-sm px-4 py-1.5  cursor-pointer rounded-2xl border-2 border-gray-200 transition-colors',
              selected === benefit
                ? 'text-white bg-amber-400 border-amber-400 '
                : 'bg-white hover:text-amber-500',
              'active:scale-[0.96] ',
            )}
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
