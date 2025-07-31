import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { getSharePostById } from '@/domains/Explore/api/share';
import SelectFields from '@/domains/Explore/components/share/SelectFields';
import PostContentFields from '@/domains/Explore/components/share/PostContentFields';
import DateTimePicker from '@/domains/Explore/components/share/DateTimePicker';
import PlaceField from '@/domains/Explore/components/share/PlaceField';
import { updateMySharePost } from '@/domains/MyPage/api/myShare';
import { LoadingSpinner } from '@/domains/MyPage/components/LoadingSpinner';

const ShareEditPage = () => {
  const { postId = '' } = useParams();

  const navigate = useNavigate();

  const [category, setCategory] = useState<SelectOption | null>({
    label: '',
    value: '',
  });
  const [brand, setBrand] = useState<SelectOption | null>({
    label: '',
    value: '',
  });
  const [benefitType, setBenefitType] = useState<SelectOption | null>({
    label: '',
    value: '',
  });
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
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const { setHasUnsavedChanges } = useUnsavedChanges();

  const parseTimeValue = (dateString: string): TimeValue => {
    const date = new Date(dateString);

    let hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');

    const period = hour < 12 ? '오전' : '오후';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;

    return {
      period,
      hour: hour.toString().padStart(2, '0'),
      minute,
    };
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getSharePostById(postId);
        setCategory({ label: data.category, value: data.category });
        setBrand({ label: data.brandName, value: '' });
        setBenefitType({ label: data.benefitName, value: '' });
        setTitle(data.title);
        setContent(data.content);
        setDate(data.promiseDate.split('T')[0]);
        setPlace(data.location);
        const parsedTime = parseTimeValue(data.promiseDate);
        setTime(parsedTime);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };

    fetchPost();
  }, []);

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

    setIsConfirmLoading(true);
    try {
      await updateMySharePost(newPost, postId);
      setHasUnsavedChanges(false);
      navigate(`/explore/share/${postId}`);
    } catch (error) {
      alert('수정 실패' + error);
    } finally {
      setIsConfirmLoading(false);
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
        <Button
          onClick={handleSubmit}
          size="lg"
          disabled={isConfirmLoading}
          width={'106px'}
        >
          {isConfirmLoading ? (
            <div className="w-6 h-6">
              <LoadingSpinner />
            </div>
          ) : (
            '수정하기'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ShareEditPage;
