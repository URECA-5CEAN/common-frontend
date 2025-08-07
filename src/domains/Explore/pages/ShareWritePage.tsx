import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import {
  getDefaultTime,
  getTodayString,
  toISOStringFromDateTime,
} from '../utils/datetimeUtils';
import type {
  PostWriteRequest,
  SelectOption,
  Store,
  TimeValue,
} from '../types/share';
import SelectFields from '../components/share/SelectFields';
import PostContentFields from '../components/share/PostContentFields';
import DateTimePicker from '../components/share/DateTimePicker';
import PlaceField from '../components/share/PlaceField';
import { createSharePost } from '../api/share';
import { useNavigate } from 'react-router-dom';
import { useUnsavedChanges } from '../../../contexts/UnsavedChangesContext';
import { ChevronLeft } from 'lucide-react';
import SelectStoreModal from '../components/share/SelectStoreModal';
import toast from 'react-hot-toast';
import { Modal } from '@/components/Modal';
import dolphin from '@/assets/image/dolphin_normal.png';

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
  const [outModal, setOutModal] = useState(false);

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
      navigate('/explore/share');
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

  const handleBackClick = () => {
    setOutModal(true);
  };
  const outConfirmClick = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
        <button
          className="w-10 h-10 mb-4 cursor-pointer"
          onClick={handleBackClick}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={40} />
        </button>
        <h2 className="text-[28px] font-bold mb-6 ">나눔 글 작성</h2>

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
      {
        <Modal
          isOpen={outModal}
          onClose={() => setOutModal(false)}
          title="작성을 그만두시겠어요?"
          description="페이지를 나가면 작성한 내용은 저장되지 않고 모두 사라져요"
          actions={
            <>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => setOutModal(false)}
              >
                취소
              </Button>
              <Button onClick={outConfirmClick} fullWidth>
                그만두기
              </Button>
            </>
          }
          img={
            <div className="w-full flex justify-center">
              <img src={dolphin} alt="캐릭터" className="w-30 h-30" />
            </div>
          }
        />
      }
    </>
  );
};

export default ShareWritePage;
