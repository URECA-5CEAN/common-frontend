import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Plus } from 'lucide-react';
import type { MenuType, Panel } from './sidebar/MapSidebar';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { uploadReceiptImage } from '../api/store';

interface BenefitModalProps {
  panel: Panel;
  selectedFile: File;
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
  const handleOCRUpload = async (file: File) => {
    if (!selectedFile) {
      return;
    }
    try {
      const result = await uploadReceiptImage(file);
      console.log(result);
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
            ) : (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  {selectedFile && selectedFile?.name} 선택됨
                </p>
              </>
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
              openmenu('지도'); // 모달도 닫기
            }}
          >
            제출하기
          </Button>
        </div>
      ></Modal>
    </>
  );
}
