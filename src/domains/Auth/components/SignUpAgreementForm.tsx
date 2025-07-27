import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/Button';

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
          <strong>수집하는 개인정보의 항목</strong>
          <p>개인정보 수집/이용 동의
          회원은 “지중해”의 개인정보 수집 및 이용동의를 거부 할 수 있습니다.
          단, 동의를 거부하는 경우 본인확인서비스가 정상적으로 제공되지 않을 수 있습니다.</p>

          <strong>[수집 및 이용 목적]</strong>
          <p>회원 식별 및 본인 인증
          회원이 입력한 본인확인정보의 정확성 여부 확인
          회원이 요청한 서비스 이용을 위한 정보제공
          서비스 이용 통계 및 품질 개선
          부정 이용 방지 및 수사의뢰</p>

          <strong>[수집 및 이용 항목]</strong>
          <p>필수 수집 항목 : 이름, 생년월일, 이메일, 전화번호, 닉네임</p>
          <p>선택 수집 항목 : 해당 없음</p>

          <strong>[보유 및 이용기간]</strong>
          <p>회원가입 완료 시점부터 회원 탈퇴 처리 완료시까지 보관합니다.
          다만, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간까지 보관합니다.</p>
        `,
      },
      terms: {
        title: '서비스 이용약관',
        content: `
          <strong>제 1조 (목적)</strong>
          <p>
            본 약관은 “지중해”가 제공하는 서비스(이하 “서비스”라고 한다)에 관한
            이용조건 및 의무 등 기본적인 사항을 규정함을 목적으로 합니다.
          </p>

          <strong>제 2조 (용어의 정의)</strong>
          <ol>
            <li>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
              <ol>
                <li>서비스 : 지중해와 직접 연동되어 온라인에서 이용할 수 있는 일체의 서비스입니다.</li>
                <li>사이트 : 서비스를 제공하는 온라인 홈페이지입니다.</li>
                <li>이용자 : 약관에 따라 지중해가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
                <li>회원 : 사이트에 접속하여 본 약관에 동의하고, 이메일과 비밀번호 등(외 회원가입 시 입력하는 필수항목)을 사용하여 본 서비스에 등록한 자를 말합니다.</li>
                <li>비회원 : 회원으로 가입하지 않고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</li>
                <li>운영진 : 본 서비스 개발에 참여하고 유지 및 운영하는 사람입니다. (김민석, 김정민, 김지산, 문태신, 송은재, 이민규, 한여준) 7명에 해당합니다.</li>
              </ol>
            </li>
          </ol>

          <strong>제 3조 (약관의 효력 및 변경)</strong>
          <ol>
            <li>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력을 발생합니다.</li>
            <li>본 약관의 내용은 서비스 화면에 게시하여 회원에게 공시하고, 이에 동의한 회원이 서비스에 가입함으로써 효력이 발생합니다.</li>
            <li>운영진은 필요하다고 인정되는 경우 본 약관을 변경할 수 있으며, 약관을 변경할 경우에는 적용일자 및 변경사유를 명시하여 공지합니다.</li>
            <li>운영진이 제 3항에 따라 변경 약관을 공지 또는 통지하면서, 회원에게 약관 변경 적용일까지 거부의사를 표시하지 않을 경우, 약관의 변경에 동의한 것으로 간주합니다.</li>
          </ol>

          <strong>제 4조 (약관 외 준칙)</strong>
          <ol>
            <li>본 약관에 명시되지 않은 사항에 대해서는 전기통신기본법, 전기통신사업법 등 관계법령 및 회사가 정한 서비스의 세부이용지침 등의 규정에 의합니다.</li>
          </ol>

          <strong>제 5조 (이용 계약의 성립)</strong>
          <ol>
            <li>회원은 약관내용에 대하여 동의여부를 체크하는 방법으로 동의할 수 있습니다. 회원이 동의 부분에 체크하면 이 약관에 대해 동의한 것으로 봅니다.</li>
            <li>이용 계약은 회원가입 신청 절차에 따른 회원의 신청에 대하여 운영진이 승낙함으로써 성립합니다.</li>
            <li>운영진은 다음 각호에 해당하는 신청에 대하여는 승낙하지 않거나 사후에 이용계약을 해지할 수 있습니다.
              <ul>
                <li>허위 내용 등록</li>
                <li>타인의 명의를 도용한 경우</li>
                <li>기타 회원으로 부적합하다고 판단되는 경우</li>
              </ul>
            </li>
          </ol>

          <strong>제 6조 (운영진의 의무)</strong>
          <ol>
            <li>운영진은 서비스 제공과 관련하여 인지한 이용자의 본인확인정보를 본인의 승낙없이 제 3자에게 누설하거나 배포하지 않습니다. 단, 국가기관의 요구가 있는 경우, 범죄에 대한 수사상의 목적이 있는 경우 등 기타 관련법령에서 정한 절차에 따른 요청이 있는 경우에는 그러하지 않습니다.</li>
          </ol>

          <strong>제 7조 (회원의 의무)</strong>
          <ol>
            <li>회원은 서비스를 이용함에 있어서 다음에 해당하는 행위를 하여서는 안되며, 운영진은 위반 행위에 따르는 일체의 법적 책임을 지지 않습니다.
              <ul>
                <li>타 회원의 정보를 부정하게 사용 및 도용하는 행위</li>
                <li>운영진의 저작권, 제 3자의 저작권 등 기타 권리를 침해하는 행위</li>
                <li>범죄 행위</li>
                <li>기타 관련 법령에 위배되는 행위</li>
              </ul>
            </li>
            <li>회원은 이메일, 비밀번호 관리에 대한 책임이 있으며, 제 3자에게 이용을 허락해서는 안됩니다.</li>
            <li>이용자는 회사 또는 제 3자의 지적재산권을 침해해서는 안됩니다.</li>
          </ol>

          <strong>제 8조 (서비스 이용 및 제한)</strong>
          <ol>
            <li>운영진은 연중무휴, 1일 24시간 서비스를 제공함을 원칙으로 하나, 시스템 점검·업데이트·기술적 장애 시에는 전부 또는 일부를 일시 중단할 수 있습니다.</li>
            <li>운영진은 다음에 해당하는 경우 서비스 이용을 제한할 수 있습니다.
              <ul>
                <li>이용자가 공공질서·미풍양속을 해하는 행위를 한 경우</li>
                <li>서비스 운영을 고의로 방해한 경우</li>
                <li>기타 운영진이 정한 이용조건을 위반한 경우</li>
                <li>범죄 행위를 한 경우</li>
              </ul>
            </li>
          </ol>

          <strong>제 9조 (서비스 책임 제한)</strong>
          <ol>
            <li>운영진은 천재지변·불가항력적 사유 또는 회원의 귀책사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.</li>
            <li>운영진은 회원이 서비스를 통해 게재·전송한 정보와 관련하여 발생하는 분쟁에 대해 일체의 책임을 지지 않습니다.</li>
          </ol>

          <strong>제 10조 (약관 해지 및 이용제한)</strong>
          <ol>
            <li>회원은 언제든지 마이페이지의 탈퇴 기능을 통해 이용계약 해지(탈퇴)를 신청할 수 있습니다.</li>
            <li>운영진은 회원이 약관 위반, 기타 비정상적 이용행위가 확인될 경우, 사전 통지없이 서비스 이용을 제한하거나 계약을 해지할 수 있습니다.</li>
          </ol>

          <strong>제 11조 (분쟁 해결)</strong>
          <ol>
            <li>운영진과 이용자 간 발생한 분쟁은 대한민국 법령을 준거법으로 합니다.</li>
            <li>서비스 이용으로 발생하는 분쟁에 대한 소송은 통상 관할법원(이용자의 주소지 또는 회사 소재지를 관할하는 법원)의 단독 관할로 합니다.</li>
          </ol>

          <p><strong>부칙</strong><br />이 약관은 2025년 7월 11일부터 적용합니다.</p>
          
        `,
      },
      thirdParty: {
        title: '제3자 정보제공 동의',
        content: `
          <p>지중해는 본 서비스 이용과 관련하여 아래와 같이 개인정보를 제3자에게 제공할 수 있으며,
          이에 대해 동의를 요청드립니다.</p>
          <strong>1. 제공받는 자</strong>
          <p>LG U+ (멤버십 혜택 검증 및 내역 확인 목적)</p>
          <p>제휴 가맹점 (혜택 사용 처리 및 고객 확인 목적)</p>
          <p>지도 API 제공사 (혜택 매장 위치 제공 목적)</p>
          
          <strong>2. 제공하는 항목</strong>
          <p>이름, 이메일, 주소</p>
          <p>LG U+ 멤버십 등급</p>
          <p>혜택 사용 내역 (매장명, 사용일시, 사용 항목 등)</p>
          <p>위치정보 (현재 위치, 매장 방문 위치 등)</p>

          <strong>3. 제공 목적</strong>
          <p>멤버십 혜택 확인 및 처리</p>
          <p>맞춤형 혜택 및 서비스 제공</p>
          <p>사용자 통계 분석 및 서비스 개선</p>
          <p>혜택 사용 매장 위치 안내</p>
          
          <strong>4. 보유 및 이용기간</strong>
          <p>회원 탈퇴 또는 개인정보 수집·이용 동의 철회 시까지 (단, 관련 법령에 따라 일정 기간 보관이 필요한 경우에는 그 기간 동안 보관)</p>

          <strong>5. 동의 거부 권리 및 불이익</strong>
          <p>귀하는 위 개인정보 제3자 제공에 대한 동의를 거부할 수 있습니다. 단, 동의하지 않을 경우 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
        `,
      },
    };

    setModalContent(modalData[type]);
    setModalOpen(true);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full border-4 border-[#64A8CD]">
        <h1 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-center text-gray-700">
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
              <span className="text-sm md:text-base text-gray-700 font-semibold">
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
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-[90%] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200 text-center">
              <h2 className="text-base md:text-2xl font-semibold text-gray-800">
                {modalContent.title}
              </h2>
            </div>

            {/* 모달 콘텐츠 */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div
                className="prose max-w-none text-gray-700 text-xs md:text-base"
                dangerouslySetInnerHTML={{ __html: modalContent.content }}
              />
            </div>

            {/* 모달 푸터 */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-center">
              <Button
                type="button"
                onClick={() => setModalOpen(false)}
                variant="primary"
                size="md"
                className="!bg-[#64A8CD] hover:!bg-[#5B9BC4] !text-sm w-[120px] sm:w-[150px] md:w-[180px]"
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpAgreementForm;
