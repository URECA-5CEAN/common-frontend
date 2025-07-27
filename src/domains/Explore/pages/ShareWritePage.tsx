import { Button } from '@/components/Button';
import { useState } from 'react';
import {
  getDefaultTime,
  getTodayString,
  toISOStringFromDateTime,
} from '../utils/datetimeUtils';
import type { SelectOption, TimeValue } from '../types/share';
import SelectFields from '../components/share/SelectFields';
import PostContentFields from '../components/share/PostContentFields';
import DateTimePicker from '../components/share/DateTimePicker';
import PlaceField from '../components/share/PlaceField';

const ShareWritePage = () => {
  const [category, setCategory] = useState<SelectOption | null>(null);
  const [brand, setBrand] = useState<SelectOption | null>(null);
  const [benefitType, setBenefitType] = useState<SelectOption | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => getTodayString());
  const [place, setPlace] = useState('');
  const [time, setTime] = useState<TimeValue>(() => getDefaultTime());

  const handleSubmit = async () => {
    if (
      !category ||
      !brand ||
      !benefitType ||
      !title ||
      !content ||
      !date ||
      !time
    ) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    const newPost = {
      category: category.value,
      brandId: brand.value,
      benefitId: benefitType.value,
      title,
      content,
      promiseDate: toISOStringFromDateTime(date, time),
      location: place || '미정',
    };

    console.log('작성한 데이터:', newPost);
  };

  return (
    <div className="w-full max-w-[1050px] m-6">
      <h2 className="text-[28px] font-bold mb-6">나눔 글 작성</h2>

      <SelectFields
        selectedCategory={category}
        setSelectedCategory={setCategory}
        selectedBrand={brand}
        setSelectedBrand={setBrand}
        selectedBenefitType={benefitType}
        setSelectedBenefitType={setBenefitType}
      />

      <PostContentFields
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
      />

      <DateTimePicker
        date={date}
        setDate={setDate}
        selectedTime={time}
        setSelectedTime={setTime}
      />

      <PlaceField place={place} setPlace={setPlace} />

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} size="lg">
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default ShareWritePage;
