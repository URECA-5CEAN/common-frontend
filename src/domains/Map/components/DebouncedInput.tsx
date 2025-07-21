import React, { useState, useEffect, useRef } from 'react';

import type { ChangeEvent } from 'react';

interface DebouncedInputProps {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  debounceTime?: number;
  placeholder?: string;
}

export default function DebouncedInput({
  value,
  onChange,
  debounceTime = 500,
  placeholder = '검색어를 입력하세요',
}: DebouncedInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const lastEventRef = useRef<ChangeEvent<HTMLInputElement> | null>(null);

  // 외부 value 동기화
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // debounced onChange 호출
  useEffect(() => {
    if (isComposing) return;
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
      className="flex-1 bg-transparent outline-none ml-2 text-sm"
      onChange={handleChange}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(e) => {
        setIsComposing(false);
        lastEventRef.current = e;
        setInternalValue(e.currentTarget.value);
      }}
    />
  );
}
