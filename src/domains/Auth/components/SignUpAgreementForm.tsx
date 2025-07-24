import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';

interface AgreementChecks {
  privacy: boolean;
  terms: boolean;
  thirdParty: boolean;
}

interface SignUpAgreementFormProps {
  onNext?: () => void;
}

const SignUpAgreementForm = ({ onNext }: SignUpAgreementFormProps) => {
  const navigate = useNavigate();
  const [checkAll, setCheckAll] = useState(false);
  const [checks, setChecks] = useState<AgreementChecks>({
    privacy: false,
    terms: false,
    thirdParty: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  }>({ title: '', content: '' });

  const handleCheckAll = () => {
    const newCheckAll = !checkAll;
    setCheckAll(newCheckAll);
    setChecks({
      privacy: newCheckAll,
      terms: newCheckAll,
      thirdParty: newCheckAll,
    });
  };

  const handleCheck = (key: keyof AgreementChecks) => {
    const newChecks = { ...checks, [key]: !checks[key] };
    setChecks(newChecks);

    // 모든 필수 항목이 체크되었는지 확인
    const allRequiredChecked =
      newChecks.privacy && newChecks.terms && newChecks.thirdParty;
    setCheckAll(allRequiredChecked);
  };

  // 필수 항목들이 모두 체크되었는지 확인
  const isAllRequiredChecked =
    checks.privacy && checks.terms && checks.thirdParty;

  const goToLogin = () => {
    navigate('/login');
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigate('/signup');
    }
  };

  const openModal = (type: keyof AgreementChecks) => {
    const modalData = {
      privacy: {
        title: '개인정보 이용 동의',
        content: `
          <h3>수집하는 개인정보의 항목</h3>
          <p>개인정보 수집/이용 동의
          회원은 “지중해”의 개인정보 수집 및 이용동의를 거부 할 수 있습니다.
          단, 동의를 거부하는 경우 본인확인서비스가 정상적으로 제공되지 않을 수 있습니다.

          [수집 및 이용 목적]
          회원 식별 및 본인 인증
          회원이 입력한 본인확인정보의 정확성 여부 확인
          회원이 요청한 서비스 이용을 위한 정보제공
          서비스 이용 통계 및 품질 개선
          부정 이용 방지 및 수사의뢰
                
          [수집 및 이용 항목]
          필수 수집 항목 : 이름, 생년월일, 이메일, 전화번호, 닉네임
          선택 수집 항목 : 해당 없음
                
          [보유 및 이용기간]
          회원가입 완료 시점부터 회원 탈퇴 처리 완료시까지 보관합니다.
          다만, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지 보관합니다.</p>
        `,
      },
      terms: {
        title: '서비스 이용약관',
        content: `
          <h3>제1조 (목적)</h3>
          <p>본 약관은 지중해 서비스 이용에 관한 조건 및 절차를 규정함을 목적으로 합니다.</p>
          
          <h3>제2조 (서비스의 제공)</h3>
          <p>회사는 다음과 같은 서비스를 제공합니다:</p>
          <p>- 지도 기반 정보 제공 서비스</p>
          <p>- 커뮤니티 서비스</p>
          
          <h3>제3조 (회원의 의무)</h3>
          <p>회원은 서비스 이용 시 관련 법령을 준수하여야 합니다.</p>
        `,
      },
      thirdParty: {
        title: '제3자 정보제공 동의',
        content: `
          <h3>제공받는 자</h3>
          <p>- 지도 서비스 제공업체</p>
          <p>- 결제 서비스 제공업체</p>
          
          <h3>제공하는 개인정보 항목</h3>
          <p>- 이름, 이메일</p>
          
          <h3>제공받는 자의 이용목적</h3>
          <p>- 서비스 제공 및 고객지원</p>
          
          <h3>보유 및 이용기간</h3>
          <p>- 서비스 제공 완료 시까지</p>
        `,
      },
    };

    setModalContent(modalData[type]);
    setModalOpen(true);
  };

  return (
    <div className="w-full mt-8">
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full border-4 border-[#64A8CD]">
        <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center">
          이용약관 동의
        </h1>

        {/* 전체 동의하기 섹션 */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
            지중해 서비스 내 이용자 식별, 회원 관리 및 서비스 제공을 위해
            회원님의 개인정보를 수집합니다.
            <br />
            정보는 개인정보 제3자 제공 동의 시부터 서비스 탈퇴 시까지 보관되며
            서비스 탈퇴 시 지체 없이 파기됩니다.
          </p>
        </div>

        {/* 구분선 */}
        <hr className="border-gray-200 mb-6" />

        {/* 개별 약관 동의 */}
        <div className="space-y-4 mb-8">
          <label className="flex items-start cursor-pointer mb-3">
            <input
              type="checkbox"
              checked={checkAll}
              onChange={handleCheckAll}
              className="w-5 h-5 mt-0.5 mr-3 text-[#64A8CD] rounded focus:ring-[#64A8CD] focus:ring-2"
            />
            <div>
              <span className="text-sm md:text-base font-semibold">
                전체 동의하기
              </span>
            </div>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checks.privacy}
              onChange={() => handleCheck('privacy')}
              className="w-4 h-4 mr-3 text-[#64A8CD] rounded focus:ring-[#64A8CD] focus:ring-2"
            />
            <span className="text-sm md:text-base text-gray-700 flex-1">
              [필수] 개인정보이용동의
            </span>
            <button
              type="button"
              onClick={() => openModal('privacy')}
              className="ml-2 text-gray-400 hover:text-[#64A8CD] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checks.terms}
              onChange={() => handleCheck('terms')}
              className="w-4 h-4 mr-3 text-[#64A8CD] rounded focus:ring-[#64A8CD] focus:ring-2"
            />
            <span className="text-sm md:text-base text-gray-700 flex-1">
              [필수] 서비스이용약관동의
            </span>
            <button
              type="button"
              onClick={() => openModal('terms')}
              className="ml-2 text-gray-400 hover:text-[#64A8CD] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={checks.thirdParty}
              onChange={() => handleCheck('thirdParty')}
              className="w-4 h-4 mr-3 text-[#64A8CD] rounded focus:ring-[#64A8CD] focus:ring-2"
            />
            <span className="text-sm md:text-base text-gray-700 flex-1">
              [필수] 제 3자 정보제공동의
            </span>
            <button
              type="button"
              onClick={() => openModal('thirdParty')}
              className="ml-2 text-gray-400 hover:text-[#64A8CD] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </label>
        </div>

        {/* 다음으로 버튼 */}
        <div className="mt-6 md:mt-8 pt-1">
          <Button
            type="button"
            onClick={handleNext}
            disabled={!isAllRequiredChecked}
            variant="primary"
            size="lg"
            fullWidth
            className="!bg-[#64A8CD] hover:!bg-[#5B9BC4] disabled:!bg-[#B3D4EA] !text-sm md:!text-base"
          >
            다음으로
          </Button>
        </div>

        {/* 로그인하러 가기 */}
        <p className="text-xs md:text-sm text-gray-600 text-center mt-4">
          이미 회원이신가요?{' '}
          <span
            className="text-[#64A8CD] cursor-pointer hover:underline hover:bg-gray-200 transition-colors font-medium px-2 py-2 rounded-md inline-block"
            onClick={goToLogin}
          >
            로그인하기
          </span>
        </p>
      </div>

      {/* 약관 상세 내용 모달 */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
      >
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: modalContent.content }}
        />
      </Modal>
    </div>
  );
};

export default SignUpAgreementForm;
