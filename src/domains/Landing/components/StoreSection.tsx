const StoreSection = () => {
  return (
    <div className="absolute top-[430vh] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-[40px] text-white font-bold">
            다양한 혜택이 준비되어 있어요
          </h2>
        </div>
        <p
          className="text-2xl font-medium text-center text-white mb-20"
          style={{ lineHeight: '42px' }}
        >
          전국 약 1500개의 오프라인 매장에서 혜택을 찾아보세요
        </p>

        {/* 메인 카드 */}
        <div
          className="bg-[#EEEEEE] rounded-2xl max-w-6xl w-full overflow-hidden"
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
        >
          <div className="flex h-[300px]">
            {/* 왼쪽 - 제목 */}
            <div
              className="bg-[#FFBC52] rounded-2xl flex flex-col justify-center items-center p-8"
              style={{ width: '280px' }}
            >
              <h3 className="text-[28px] text-white font-bold mb-6">
                멤버십 제휴처
              </h3>
            </div>

            {/* 오른쪽 - 제휴처 로고 그리드 */}
            <div className="flex-1 bg-[#EEEEEE] rounded-r-2xl p-6">
              <div className="grid grid-cols-7 gap-3 h-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSection;
