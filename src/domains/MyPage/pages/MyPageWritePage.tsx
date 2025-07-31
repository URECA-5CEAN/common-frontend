import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnsavedChanges } from '../../../contexts/UnsavedChangesContext';
import type {
  PostWriteRequest,
  SelectOption,
  TimeValue,
} from '@/domains/Explore/types/share';
import {
  getDefaultTime,
  getTodayString,
  toISOStringFromDateTime,
} from '@/domains/Explore/utils/datetimeUtils';
import { createSharePost } from '@/domains/Explore/api/share';
import SelectFields from '@/domains/Explore/components/share/SelectFields';
import PostContentFields from '@/domains/Explore/components/share/PostContentFields';
import DateTimePicker from '@/domains/Explore/components/share/DateTimePicker';
import PlaceField from '@/domains/Explore/components/share/PlaceField';

const MyPageWritePage = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<SelectOption | null>(null);
  const [brand, setBrand] = useState<SelectOption | null>(null);
  const [benefitType, setBenefitType] = useState<SelectOption | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => getTodayString());
  const [place, setPlace] = useState('');
  const [time, setTime] = useState<TimeValue>(() => getDefaultTime());
  const [initialValues] = useState(() => ({
    category: null,
    brand: null,
    benefitType: null,
    title: '',
    content: '',
    date: getTodayString(),
    place: '',
    time: getDefaultTime(),
  }));

  const { setHasUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    const hasChanges =
      category !== initialValues.category ||
      brand !== initialValues.brand ||
      benefitType !== initialValues.benefitType ||
      title !== initialValues.title ||
      content !== initialValues.content ||
      date !== initialValues.date ||
      place !== initialValues.place ||
      JSON.stringify(time) !== JSON.stringify(initialValues.time);

    setHasUnsavedChanges(hasChanges);
  }, [
    category,
    brand,
    benefitType,
    title,
    content,
    date,
    place,
    time,
    initialValues,
    setHasUnsavedChanges,
  ]);

  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

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

    const newPost: PostWriteRequest = {
      category: category.value,
      brandId: brand.value,
      benefitId: benefitType.value,
      title,
      content,
      promiseDate: toISOStringFromDateTime(date, time),
      location: place || '미정',
    };

    try {
      await createSharePost(newPost);
      setHasUnsavedChanges(false);
      navigate('/explore/share');
    } catch (error) {
      alert('작성 실패' + error);
    }
  };

  return (
    <div className="w-[calc(100%-48px)] max-w-[1050px] m-6">
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

export default MyPageWritePage;
