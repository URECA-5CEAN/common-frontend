import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Plus } from 'lucide-react';
import type { MenuType, Panel } from './sidebar/MapSidebar';
import {
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { saveBenefitData, uploadReceiptImage } from '../api/store';

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
  const [amout, setAmount] = useState<number>(0);
  const handleOCRUpload = async (file: File) => {
    if (!selectedFile) {
      return;
    }
    try {
      const result = await uploadReceiptImage(file);
      if (result) setIsResult(true);
      if (!result) return;
      const response = await saveBenefitData(
        {
          storeName: result.storeName ?? '',
          category: result.category ?? '',
          address: result.address ?? '',
          visitedAt: result.visitedAt ?? new Date().toISOString(),
          totalAmount: result.totalAmount ?? 0,
        },
        amout,
        'test@test.com',
      );
      setAmount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal
        isOpen={panel.menu === '혜택인증'}
        title="멤버십 혜택 사용 인증하기"
        description={
          <div className="px-10 py-6  text-black flex flex-col justify-center items-center ">
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
                <Plus size={40} className="text-gray-400 hover:text-white " />
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileSelect}
                />
              </label>
            ) : !isResult ? (
              <p className="mt-2 text-sm text-gray-600">
                {selectedFile.name} 선택됨
              </p>
            ) : (
              <input
                type="text"
                placeholder="할인받은 금액 입력"
                value={amout}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(Number(e.target.value))
                }
                className="mt-2 text-sm border border-gray-200 py-2 px-2 w-[100%]"
              ></input>
            )}
          </div>
        }
        onClose={() => openmenu('지도')}
        actions=<div className="flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              openmenu('지도');
              setSelectedFile(null);
            }}
          >
            취소
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={async () => {
              if (!selectedFile) return;
              await handleOCRUpload(selectedFile); // 파일 먼저 전송하고
              setSelectedFile(null); // 전송 끝난 후 초기화
            }}
          >
            제출하기
          </Button>
        </div>
      ></Modal>
    </>
  );
}
