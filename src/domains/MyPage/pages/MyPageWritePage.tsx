import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnsavedChanges } from '../../../contexts/UnsavedChangesContext';
import { ChevronLeft } from 'lucide-react';

import toast from 'react-hot-toast';
import type {
  PostWriteRequest,
  SelectOption,
  Store,
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
import SelectStoreModal from '@/domains/Explore/components/share/SelectStoreModal';

const ShareWritePage = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<SelectOption | null>(null);
  const [brand, setBrand] = useState<SelectOption | null>(null);
  const [benefitType, setBenefitType] = useState<SelectOption | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(() => getTodayString());
  const [time, setTime] = useState<TimeValue>(() => getDefaultTime());
  const [initialValues] = useState(() => ({
    category: null,
    brand: null,
    benefitType: null,
    title: '',
    content: '',
    date: getTodayString(),
    storeId: null,
    time: getDefaultTime(),
  }));
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { setHasUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    const hasChanges =
      category !== initialValues.category ||
      brand !== initialValues.brand ||
      benefitType !== initialValues.benefitType ||
      title !== initialValues.title ||
      content !== initialValues.content ||
      date !== initialValues.date ||
      selectedStore?.id !== initialValues.storeId ||
      JSON.stringify(time) !== JSON.stringify(initialValues.time);

    setHasUnsavedChanges(hasChanges);
  }, [
    category,
    brand,
    benefitType,
    title,
    content,
    date,
    time,
    initialValues,
    setHasUnsavedChanges,
    selectedStore,
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
      !time ||
      !selectedStore
    ) {
      toast.error(<span>모든 항목을 입력해주세요.</span>, {
        duration: 2000,
        style: {
          border: '1px solid #ebebeb',
          padding: '16px',
          color: '#e94e4e',
        },
        iconTheme: {
          primary: '#e94e4e',
          secondary: '#FFFAEE',
        },
      });
      return;
    }

    const newPost: PostWriteRequest = {
      category: category.value,
      brandId: brand.value,
      benefitId: benefitType.value,
      title,
      content,
      promiseDate: toISOStringFromDateTime(date, time),
      storeId: selectedStore?.id,
    };

    try {
      await createSharePost(newPost);
      setHasUnsavedChanges(false);
      navigate('/mypage/share');
    } catch (error) {
      alert('작성 실패' + error);
    }
  };

  const handleOpenModal = () => {
    if (!category || !brand) {
      toast.error(<span>카테고리와 브랜드를 먼저 선택해주세요.</span>, {
        duration: 2000,
        style: {
          border: '1px solid #ebebeb',
          padding: '16px',
          color: '#e94e4e',
        },
        iconTheme: {
          primary: '#e94e4e',
          secondary: '#FFFAEE',
        },
      });
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="w-[calc(100%-48px)] max-w-[1050px] m-6">
      <div className="flex  md:flex-row flex-col">
        <ChevronLeft
          size={40}
          className="relative right-3 text-gray-500 cursor-pointer "
          onClick={() => navigate('/explore/share')}
        />
        <h2 className="text-[28px] font-bold mb-6 ">나눔 글 작성</h2>
      </div>

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

      <PlaceField selectedStore={selectedStore} onOpen={handleOpenModal} />

      {showModal && (
        <SelectStoreModal
          category={category?.label || null}
          brand={brand?.label || null}
          onClose={() => setShowModal(false)}
          onSelect={(store) => setSelectedStore(store)}
        />
      )}

      <div className="flex justify-end mt-6">
        <Button onClick={handleSubmit} size="lg">
          등록하기
        </Button>
      </div>
    </div>
  );
};

export default ShareWritePage;
