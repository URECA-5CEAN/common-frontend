import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { Plus } from 'lucide-react';
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
import dolphinFind from '@/assets/image/dolphin_find.png';
import toast from 'react-hot-toast';
import { increaseUserExp } from '@/domains/MyPage/api/mission';
import { useNavigate } from 'react-router-dom';

import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css';
import { LevelupModal } from '@/components/LevelupModal';
import { ExpContent, LevelContent } from '@/components/ExpLevel';
import type { ExpResultType } from '@/types/expResult';
import Lottie from 'lottie-react';
import warning from '@/assets/lottie/Warning.json';
import success from '@/assets/lottie/Success.json';
import { useAuthStore } from '@/store/useAuthStore';

interface BenefitModalProps {
  isBenefitModalOpen: boolean;
  setIsBenefitModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: File | null;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
}

export default function BenefitModal({
  isBenefitModalOpen,
  setIsBenefitModalOpen,
  selectedFile,
  handleFileSelect,
  setSelectedFile,
}: BenefitModalProps) {
  const [isResult, setIsResult] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfoApi>();
  const [ocrResult, setOcrResult] = useState<BenefitData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrError, setOcrError] = useState(false);
  const [levelUpdated, setLevelUpdated] = useState(false);
  const [expResult, setExpResult] = useState<ExpResultType>({
    exp: 0,
    level: 0,
    levelUpdated: false,
    prevExp: 0,
    expReward: 0,
    missionName: '',
  });
  const [finalSubmitSuccess, setFinalSubmitSuccess] = useState(false);
  const [shouldShowLevelup, setShouldShowLevelup] = useState(false);
  const [duplicateReceipt, setDuplicateReceipt] = useState(false);

  const { isLoggedIn } = useAuthStore();

  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) return;
    const fetchUserData = async () => {
      const userInfoRes = await getUserInfo();
      setUserInfo(userInfoRes.data);
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    if (selectedFile) {
      handleOCRUpload(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    if (
      ocrResult?.address === '' ||
      ocrResult?.benefitAmount === undefined ||
      ocrResult?.category === '' ||
      ocrResult?.storeName === '' ||
      ocrResult?.totalAmount === undefined ||
      ocrResult?.visitedAt === ''
    ) {
      setOcrError(true);
    } else {
      setOcrError(false);
    }
  }, [ocrResult]);

  const handleOCRUpload = async (file: File) => {
    if (!file || !userInfo) return;
    setIsLoading(true);

    try {
      const result = await uploadReceiptImage(file, userInfo.email);
      if (result) {
        setOcrResult(result);
        setIsResult(true);
      }
    } catch (err) {
      console.error('OCR 업로드 실패:', err);
      setOcrError(true);
    } finally {
      setIsLoading(false);
    }
  };

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
          benefitAmount: ocrResult.benefitAmount ?? 0,
        },
        Number(amount),
        userInfo.email,
      );

      if (response.data.statusCode === 30009) {
        setDuplicateReceipt(true);
        setIsResult(false);
        return;
      }

      const expReward = 10;
      const res = await increaseUserExp(expReward);

      const prevExp = res.data.levelUpdated
        ? 50 - (expReward - res.data.exp)
        : res.data.exp - expReward;

      setExpResult({
        ...res.data,
        prevExp,
        expReward,
      });
      setFinalSubmitSuccess(true);
      if (res.data.levelUpdated) {
        setShouldShowLevelup(true);
      }
    } catch (err) {
      console.error('저장 실패:', err);
      toast.error(<span>잠시 후 다시 시도해주세요.</span>, {
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
    } finally {
      // 초기화
      setAmount(null);
      setIsResult(false);
      setSelectedFile(null);
      setOcrResult(null);
      setIsBenefitModalOpen(false);
    }
  };

  const handleReset = () => {
    setAmount(null);
    setIsResult(false);
    setSelectedFile(null);
    setOcrResult(null);
    setOcrError(false);
    setDuplicateReceipt(false);
  };

  const formattedDate = ocrResult?.visitedAt
    ? ocrResult.visitedAt.replace('T', ' ')
    : '';

  const cancelOCRUpload = () => {
    setAmount(null);
    setIsResult(false);
    setSelectedFile(null);
    setOcrResult(null);
    setOcrError(false);
    setDuplicateReceipt(false);
  };

  if (!isLoggedIn) {
    return (
      <Modal
        isOpen={isBenefitModalOpen}
        onClose={() => {
          setIsBenefitModalOpen(false);
        }}
        title="로그인이 필요한 서비스에요"
        description={
          <>
            로그인 후 혜택 인증하고 경험치를 모아보세요.
            <br />
            경험치를 모아서 기프티콘을 받을 수 있어요!
          </>
        }
        actions={
          <>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setIsBenefitModalOpen(false)}
            >
              닫기
            </Button>
            <Button fullWidth onClick={() => navigate('/login')}>
              로그인하기
            </Button>
          </>
        }
      ></Modal>
    );
  }

  return (
    <>
      <Modal
        isOpen={isBenefitModalOpen}
        title="멤버십 혜택 사용 인증하기"
        description={
          <div className="flex flex-col justify-center items-center gap-5">
            {!selectedFile ? (
              <>
                영수증을 촬영하여 올려주시면
                <br />
                내역을 확인한 후 인증을 도와드릴게요!
                <label
                  htmlFor="image-upload"
                  className="hover:bg-primaryGreen-40 flex mt-10 mb-10 flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primaryGreen transition-colors"
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
              </>
            ) : isLoading ? (
              <div className="min-h-[208px] flex flex-col justify-center items-center gap-5">
                <div className="relative w-30 h-30 flex flex-col justify-center items-center">
                  <Grid size="100" speed="1.5" color="#6fc3d1" />
                </div>
                <p className="text-gray-500 text-sm">
                  올려주신 영수증을 확인하고있어요
                </p>
              </div>
            ) : ocrError ? (
              <div className="min-h-[208px] flex flex-col justify-center w-full items-center gap-5">
                <div className="w-full flex justify-end">
                  <Button width="110px" size="sm" onClick={handleReset}>
                    다시 시도하기
                  </Button>
                </div>
                <img src={dolphinFind} alt="돌고래" className="w-25" />
                <p className="text-dangerRed">
                  영수증 인식에 실패했어요.
                  <br />
                  계속 실패한다면 잠시 후 다시 시도해주세요.
                </p>
              </div>
            ) : isResult ? (
              <>
                <p className="break-keep">
                  영수증에서 아래 항목을 인식했어요.
                  <br />
                  내용이 맞다면 ‘등록하기’를 눌러 인증을 완료해주세요!
                </p>

                <div className="min-h-[208px] text-gray-700 space-y-2 text-left w-full break-keep flex flex-col justify-center">
                  <div className="w-full flex justify-end">
                    <Button width="110px" size="sm" onClick={handleReset}>
                      다시 시도하기
                    </Button>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 flex-1 text-right">
                      방문한 매장
                    </span>
                    <span className="flex-3 md:flex-2">
                      {ocrResult?.storeName}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="min-w-17 text-gray-500 flex-1 text-right">
                      매장 주소
                    </span>
                    <span className="flex-3 md:flex-2">
                      {ocrResult?.address}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="min-w-17 text-gray-500 flex-1 text-right">
                      결제 금액
                    </span>
                    <span className="flex-3 md:flex-2">
                      {ocrResult?.totalAmount != null
                        ? `${ocrResult.totalAmount.toLocaleString()}원`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="min-w-17 text-gray-500 flex-1 text-right">
                      혜택 금액
                    </span>
                    <span className="flex-3 md:flex-2">
                      {ocrResult?.benefitAmount != null
                        ? `${ocrResult.benefitAmount.toLocaleString()}원`
                        : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="min-w-17 text-gray-500 flex-1 text-right">
                      방문일자
                    </span>
                    <span className="flex-3 md:flex-2">{formattedDate}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="min-h-[208px]"></div>
            )}
          </div>
        }
        onClose={() => {
          cancelOCRUpload();
          setIsBenefitModalOpen(false);
        }}
        actions={
          <>
            <Button
              variant="secondary"
              size="md"
              fullWidth={true}
              onClick={() => {
                cancelOCRUpload();
                setIsBenefitModalOpen(false);
              }}
            >
              취소
            </Button>
            <Button
              fullWidth
              onClick={() => {
                handleFinalSubmit();
                setIsBenefitModalOpen(false);
              }}
              disabled={!ocrResult || ocrError}
            >
              등록하기
            </Button>
          </>
        }
      />
      {(duplicateReceipt || finalSubmitSuccess) && (
        <Modal
          isOpen={duplicateReceipt || finalSubmitSuccess}
          onClose={() => {
            setDuplicateReceipt(false);
            setFinalSubmitSuccess(false);
            if (shouldShowLevelup) {
              setLevelUpdated(true);
            }
          }}
          title={
            duplicateReceipt ? '이미 등록된 영수증이에요' : '혜택 인증 성공'
          }
          actions={
            <>
              <Button
                fullWidth
                variant="secondary"
                onClick={() => {
                  setDuplicateReceipt(false);
                  setFinalSubmitSuccess(false);
                  if (shouldShowLevelup) {
                    setLevelUpdated(true);
                  }
                }}
              >
                닫기
              </Button>
              {duplicateReceipt ? (
                <Button
                  fullWidth
                  onClick={() => {
                    handleReset();
                    setIsBenefitModalOpen(true);
                    setDuplicateReceipt(false);
                  }}
                >
                  다시하기
                </Button>
              ) : (
                <></>
              )}
            </>
          }
        >
          <div className="min-h-[208px] text-gray-700 space-y-2 text-left w-full break-keep flex flex-col justify-center items-center">
            {duplicateReceipt ? (
              <>
                <Lottie
                  animationData={warning}
                  loop={false}
                  className="w-30 h-30"
                />
                <p className="text-gray-500 text-center">
                  이미 등록된 영수증이에요.
                  <br />
                  다른 영수증으로 다시 시도하시겠어요?
                </p>
              </>
            ) : (
              <>
                <Lottie
                  animationData={success}
                  loop={false}
                  className="w-30 h-30"
                />
                <p className="text-gray-500 text-center">
                  혜택 인증에 성공했어요!
                  <span className="text-primaryGreen-80 font-bold">
                    경험치 +10
                  </span>
                </p>
              </>
            )}
          </div>
        </Modal>
      )}

      <LevelupModal
        isOpen={levelUpdated}
        onClose={() => setLevelUpdated(false)}
        title="레벨이 올랐어요!"
        actions={
          <>
            <Button
              fullWidth
              variant="secondary"
              onClick={() => setLevelUpdated(false)}
            >
              닫기
            </Button>
            <Button fullWidth onClick={() => navigate('/mypage/profile')}>
              마이페이지
            </Button>
          </>
        }
      >
        <div className="my-5 md:my-10 flex flex-col justify-center items-center gap-4">
          <LevelContent
            startValue={expResult.level - 1}
            endValue={expResult.level}
          />
          <ExpContent
            levelUpdated={expResult.levelUpdated}
            startValue={expResult.prevExp}
            endValue={expResult.exp}
          />
        </div>
      </LevelupModal>
    </>
  );
}
