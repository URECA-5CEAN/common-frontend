interface FilterButtonProps {
  text: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  text,
  onClick,
}) => (
  <div
    className="min-h-[38px] min-w-[104px] py-1 px-3 flex justify-center items-center 
               border border-gray-200 rounded-full cursor-pointer hover:bg-gray-50 
               transition-colors duration-200"
    onClick={onClick}
    role="button"
    aria-label={text}
  >
    {text}
  </div>
);
