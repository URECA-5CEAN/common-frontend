import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Plus } from 'lucide-react';
import type { MenuType, Panel } from './sidebar/MapSidebar';
import {
  useEffect,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  saveBenefitData,
  uploadReceiptImage,
  type BenefitData,
} from '../api/store';
import type { UserInfoApi } from '@/domains/MyPage/types/profile';
import { getUserInfo } from '@/domains/MyPage/api/profile';

interface BenefitModalProps {
  panel: Panel;
  selectedFile: File | null;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  openmenu: (menu: MenuType) => void;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
}

export default function BenefitModal({
  panel,
  selectedFile,
  handleFileSelect,
  openmenu,
  setSelectedFile,
}: BenefitModalProps) {
  const [isResult, setIsResult] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoApi>();
  const [ocrResult, setOcrResult] = useState<BenefitData | null>(null);
  const token = localStorage.getItem('authToken');

  const handleOCRUpload = async (file: File) => {
    if (!file || !userInfo) return;
    try {
      const result = await uploadReceiptImage(file, userInfo.email);
      if (result) {
        setOcrResult(result);
        setIsResult(true);
      }
    } catch (err) {
      console.error('OCR 업로드 실패:', err);
    }
  };
  console.log(ocrResult);
  const handleFinalSubmit = async () => {
    if (!ocrResult || !userInfo) return;
    try {
      const response = await saveBenefitData(
        {
          storeName: ocrResult.storeName ?? '',
          category: ocrResult.category ?? '',
          address: ocrResult.address ?? '',
          visitedAt: ocrResult.visitedAt ?? new Date().toISOString(),
          totalAmount: ocrResult.totalAmount ?? 0,
        },
        Number(amount),
        userInfo.email,
      );
      console.log('저장 완료:', response);

      // 초기화
      setAmount(null);
      setIsResult(false);
      setSelectedFile(null);
      setOcrResult(null);
      openmenu('지도');
    } catch (err) {
      console.error('저장 실패:', err);
    }
  };

  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      const userInfoRes = await getUserInfo();
      setUserInfo(userInfoRes.data);
    };
    fetchUserData();
  }, [token]);

  return (
    <Modal
      isOpen={panel.menu === '혜택인증'}
      title="멤버십 혜택 사용 인증하기"
      description={
        <div className="px-10 py-6 text-black flex flex-col justify-center items-center">
          영수증을 촬영하여 올려주시면
          <br />
          아래 항목을 확인한 후 인증을 도와드릴게요!
          <br />
          <p className="text-gray-400">
            (확인항목: 제휴처, 결제시간, 할인금액)
          </p>
          {!selectedFile ? (
            <label
              htmlFor="image-upload"
              className="hover:bg-primaryGreen-40 flex mt-2 flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primaryGreen transition-colors"
            >
              <Plus size={40} className="text-gray-400 hover:text-white" />
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleFileSelect}
              />
            </label>
          ) : !isResult ? (
            <>
              <p className="my-4 text-sm text-gray-600">
                {selectedFile.name} 선택됨
              </p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleOCRUpload(selectedFile)}
              >
                OCR 업로드
              </Button>
            </>
          ) : (
            <>
              <input
                type="number"
                placeholder="할인받은 금액 입력"
                value={amount !== null ? amount : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setAmount(value === '' ? null : Number(value));
                }}
                className="my-4  text-sm border border-gray-200 py-2 px-2 w-full"
              />
              <Button
                variant="primary"
                fullWidth={true}
                size="md"
                onClick={handleFinalSubmit}
              >
                최종 제출
              </Button>
            </>
          )}
        </div>
      }
      onClose={() => {
        openmenu('지도');
        setSelectedFile(null);
        setIsResult(false);
        setAmount(null);
        setOcrResult(null);
      }}
      actions={
        <div className="ml-10 w-[83%] ">
          <Button
            variant="secondary"
            size="md"
            fullWidth={true}
            onClick={() => {
              openmenu('지도');
              setSelectedFile(null);
              setIsResult(false);
              setAmount(null);
              setOcrResult(null);
            }}
          >
            취소
          </Button>
        </div>
      }
    />
  );
}
