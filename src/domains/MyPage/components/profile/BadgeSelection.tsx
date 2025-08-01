import type { Badge } from '@/domains/MyPage/types/profile';

interface RadioButtonProps {
  isSelected: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({ isSelected }) => (
  <div
    className={`w-5 h-5 bg-gray-100 rounded-full flex justify-center items-center 
                ${isSelected ? 'border-2 border-primaryGreen' : 'border border-gray-200'}`}
  >
    {isSelected && <div className="w-3 h-3 bg-primaryGreen rounded-full"></div>}
  </div>
);

interface BadgeOptionProps {
  isSelected: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}

const BadgeOption: React.FC<BadgeOptionProps> = ({
  title,
  desc,
  isSelected,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex-1 p-2 md:p-4 w-full md:w-[150px] flex flex-col items-center justify-between 
                gap-2 rounded-xl text-center cursor-pointer 
                ${
                  isSelected
                    ? 'bg-primaryGreen-40 outline-2 outline-primaryGreen'
                    : 'outline-1 outline-gray-200'
                }`}
  >
    <p className="break-words whitespace-normal">{title}</p>
    <p className="text-xs">{desc}</p>
    <RadioButton isSelected={isSelected} />
  </div>
);

interface BadgeSelectionProps {
  badges?: Badge[];
  tempBadge: string;
  setTempBadge: (badgeId: string) => void;
}

const BadgeSelection: React.FC<BadgeSelectionProps> = ({
  badges,
  tempBadge,
  setTempBadge,
}) => (
  <div className="flex gap-4">
    {badges?.map((badge, idx) => (
      <BadgeOption
        key={idx}
        title={badge.title}
        desc={badge.reason}
        isSelected={tempBadge === badge.title}
        onClick={() => setTempBadge(badge.title)}
      />
    ))}
  </div>
);

export default BadgeSelection;
