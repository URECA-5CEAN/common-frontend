import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SelectOption, TimeValue } from '../types/share';

type SelectType = 'single' | 'double' | 'time';

interface CustomSelectProps {
  type: SelectType;
  value: SelectOption | TimeValue | null;
  onChange: (value: SelectOption | TimeValue | null) => void;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

const CustomSelect = ({
  type,
  placeholder,
  options,
  value,
  onChange,
  disabled = false,
  icon,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderOptions = () => {
    switch (type) {
      case 'single':
        return (
          <div className="min-w-24">
            <ul>
              {options?.map((v) => (
                <li
                  key={v.value}
                  onClick={() => {
                    onChange(v);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer p-2 rounded-xl ${
                    (value as SelectOption)?.value === v.value
                      ? 'bg-primaryGreen text-white'
                      : 'hover:bg-primaryGreen-40'
                  }`}
                >
                  {v.label}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'time': {
        const timeValue = value as TimeValue;
        return (
          <div className="flex gap-4">
            {/* 오전/오후 선택 */}
            <ul>
              <li
                onClick={() => {
                  onChange({ ...timeValue, period: '오전' });
                }}
                className={`cursor-pointer px-4 py-1 rounded ${
                  timeValue.period === '오전'
                    ? 'bg-primaryGreen text-white'
                    : 'hover:bg-primaryGreen-40'
                }`}
              >
                오전
              </li>
              <li
                onClick={() => {
                  onChange({ ...timeValue, period: '오후' });
                }}
                className={`cursor-pointer px-4 py-1 rounded ${
                  timeValue.period === '오후'
                    ? 'bg-primaryGreen text-white'
                    : 'hover:bg-primaryGreen-40'
                }`}
              >
                오후
              </li>
            </ul>
            {/* 시간 선택 */}
            <ul className="max-h-48 overflow-y-auto">
              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
                <li
                  key={h}
                  className={`cursor-pointer px-4 py-1 rounded ${
                    timeValue.hour === h
                      ? 'bg-primaryGreen text-white'
                      : 'hover:bg-primaryGreen-40'
                  }`}
                  onClick={() => {
                    onChange({ ...timeValue, hour: h });
                  }}
                >
                  {h}
                </li>
              ))}
            </ul>
            {/* 분 선택 */}
            <ul>
              {['00', '10', '20', '30', '40', '50'].map((m) => (
                <li
                  key={m}
                  className={`cursor-pointer px-5 py-1 rounded ${
                    timeValue.minute === m
                      ? 'bg-primaryGreen text-white'
                      : 'hover:bg-primaryGreen-40'
                  }`}
                  onClick={() => {
                    onChange({ ...timeValue, minute: m });
                  }}
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const displayValue = () => {
    const timeValue = value as TimeValue;
    const selectOption = value as SelectOption;

    switch (type) {
      case 'single':
        return selectOption?.label ?? placeholder;
      case 'time':
        return `${timeValue.period} ${timeValue.hour}:${timeValue.minute}`;
      default:
        return placeholder;
    }
  };

  return (
    <div className="relative text-gray-600" ref={selectRef}>
      <div
        className={`rounded-2xl border p-3 ${
          disabled
            ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-default'
            : 'border-gray-200 text-gray-600'
        }`}
      >
        <button
          onClick={() => {
            if (type === 'single' && (!options || options.length === 0)) return;
            setIsOpen(!isOpen);
          }}
          className="flex justify-between min-w-24 gap-2 items-center cursor-pointer"
          disabled={disabled}
        >
          {icon && <span className="flex items-center">{icon}</span>}
          <span className="flex-1 text-left">{displayValue()}</span>
          <ChevronDown />
        </button>
      </div>
      {isOpen && (
        <div className="absolute p-3 z-10 w-max bg-white rounded-xl border border-gray-200 mt-1">
          {renderOptions()}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
