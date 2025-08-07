import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUnsavedChanges } from '../../../contexts/UnsavedChangesContext';
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
import { getSharePostById } from '@/domains/Explore/api/share';
import SelectFields from '@/domains/Explore/components/share/SelectFields';
import PostContentFields from '@/domains/Explore/components/share/PostContentFields';
import DateTimePicker from '@/domains/Explore/components/share/DateTimePicker';
import PlaceField from '@/domains/Explore/components/share/PlaceField';
import { updateMySharePost } from '@/domains/MyPage/api/myShare';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';
import SelectStoreModal from '../components/share/SelectStoreModal';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import dolphin from '@/assets/image/dolphin_normal.png';
import { Modal } from '@/components/Modal';

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
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [outModal, setOutModal] = useState(false);

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
        setSelectedStore(null);
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
      storeId: selectedStore?.id,
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
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={isConfirmLoading}
            width={'106px'}
            loading={isConfirmLoading}
          >
            {isConfirmLoading ? (
              <div className="flex">
                <Ring
                  size="24"
                  stroke="3"
                  bgOpacity="0"
                  speed="2"
                  color="white"
                />
              </div>
            ) : (
              '수정하기'
            )}
          </Button>
        </div>
      </div>
      {
        <Modal
          isOpen={outModal}
          onClose={() => setOutModal(false)}
          title="수정을 그만두시겠어요?"
          description="페이지를 나가면 수정한 내용은 반영되지 않아요"
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

export default ShareEditPage;
