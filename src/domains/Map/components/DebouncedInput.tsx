import { useState, useEffect, useRef } from 'react';

import type { ChangeEvent } from 'react';

interface DebouncedInputProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  debounceTime?: number;
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

//제휴처 검색 시 입력중에 검색이 자동으로 진행되어 결과값 업을 경우 에러발생하여 만듬
export default function DebouncedInput({
  value = '',
  onChange,
  debounceTime = 500,
  placeholder = '검색어를 입력하세요',
  className = '',
  onFocus,
  onBlur,
}: DebouncedInputProps) {
  const [internalValue, setInternalValue] = useState<string>(value);
  // 한글 조합 중 여부
  const [isComposing, setIsComposing] = useState(false);
  const timerRef = useRef<number | null>(null);
  // 마지막 ChangeEvent 저장
  const lastEventRef = useRef<ChangeEvent<HTMLInputElement> | null>(null);

  // 외부 value가 바뀌면 internalValue 동기화
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // debounced onChange 호출
  useEffect(() => {
    if (isComposing) return; // 한글 조합 중이면 디바운스 취소
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (lastEventRef.current && onChange) {
        onChange(lastEventRef.current);
      }
    }, debounceTime);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [internalValue, isComposing, onChange, debounceTime]);

  // 사용자 입력 핸들러
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    lastEventRef.current = e;
    setInternalValue(e.target.value);
  };

  return (
    <input
      type="text"
      value={internalValue}
      placeholder={placeholder}
      className={`flex-1 bg-transparent outline-none mx-2 text-sm ${className}`}
      onChange={handleChange}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(e) => {
        // 조합이 끝난 시점에 값을 반영하고 디바운스 트리거
        setIsComposing(false);
        lastEventRef.current = e as unknown as ChangeEvent<HTMLInputElement>;
        setInternalValue(e.currentTarget.value);
      }}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
}
