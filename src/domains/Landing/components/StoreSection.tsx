import FadeInSection from '@/domains/Landing/components/FadeInSection';
import { useState, useEffect } from 'react';

interface Brand {
  id: string;
  name: string;
  image_url: string;
}

const StoreSection = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/map/brand`,
        );
        const data = await response.json();

        if (data.statusCode === 200) {
          setBrands(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <FadeInSection className="w-full mt-40 md:mt-70">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* 제목 */}
        <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl md:text-4xl text-white font-bold leading-tight">
            다양한 혜택이 준비되어 있어요
          </h2>
        </div>
        <p
          className="text-[10px] sm:text-[12px] md:text-xl lg:text-2xl font-medium text-center text-white mb-8"
          style={{ lineHeight: '1.5' }}
        >
          전국 약 15000개의 오프라인 매장에서 혜택을 찾아보세요
        </p>

        {/* 메인 카드 */}
        <div
          className="bg-[#EEEEEE] rounded-2xl max-w-6xl w-full overflow-hidden"
          style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)' }}
        >
          <div className="flex h-[180px] sm:h-[200px] md:h-[260px] lg:h-[300px] xl:h-[350px]">
            {/* 왼쪽 - 제목 */}
            <div
              className="bg-[#FFBC52] rounded-2xl flex flex-col justify-center items-center p-2 sm:p-4 md:p-6 lg:p-8"
              style={{ width: '25%' }}
            >
              <h3 className="text-[10px] sm:text-[14px] md:text-[18px] lg:text-[24px] xl:text-[28px] text-white font-bold text-center leading-tight">
                멤버십 제휴처
              </h3>
            </div>

            {/* 오른쪽 - 제휴처 로고 그리드 */}
            <div
              className="bg-[#EEEEEE] rounded-r-2xl p-2 sm:p-3 md:p-4 lg:p-6 overflow-hidden"
              style={{ width: '75%' }}
            >
              <div className="flex flex-col gap-1 sm:gap-2 md:gap-3 h-full justify-center">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-500 text-xs sm:text-sm">
                      로딩 중...
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 첫 번째 행 - 왼쪽으로 슬라이딩 */}
                    <div className="flex animate-slide-left">
                      {brands
                        .slice(0, 7)
                        .concat(brands.slice(0, 7))
                        .map((brand, index) => (
                          <div
                            key={`row1-${brand.id}-${index}`}
                            className="flex-shrink-0 flex items-center justify-center p-0.5 sm:p-1 mx-0.5 sm:mx-1"
                          >
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                    </div>

                    {/* 두 번째 행 - 오른쪽으로 슬라이딩 */}
                    <div className="flex animate-slide-right">
                      {brands
                        .slice(7, 14)
                        .concat(brands.slice(7, 14))
                        .map((brand, index) => (
                          <div
                            key={`row2-${brand.id}-${index}`}
                            className="flex-shrink-0 flex items-center justify-center p-0.5 sm:p-1 mx-0.5 sm:mx-1"
                          >
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                    </div>

                    {/* 세 번째 행 - 데스크톱에서만 표시 */}
                    <div className="hidden md:flex animate-slide-left-slow">
                      {brands
                        .slice(14, 21)
                        .concat(brands.slice(14, 21))
                        .map((brand, index) => (
                          <div
                            key={`row3-${brand.id}-${index}`}
                            className="flex-shrink-0 flex items-center justify-center p-0.5 sm:p-1 mx-0.5 sm:mx-1"
                          >
                            <img
                              src={brand.image_url}
                              alt={brand.name}
                              className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default StoreSection;
