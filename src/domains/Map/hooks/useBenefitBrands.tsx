import { useQuery } from '@tanstack/react-query';
import { fetchBrands, fetchBenefits } from '../api/store';
import type { BenefitProps, BrandProps } from '../api/store';

export function useBenefitBrands(brandName?: string) {
  return useQuery<BenefitProps[], Error>({
    queryKey: ['brandBenefits', brandName],
    queryFn: async () => {
      if (!brandName) return [];

      const brands: BrandProps[] = await fetchBrands({ keyword: brandName });
      if (brands.length === 0) return [];

      const brandId = brands[0].id;
      const benefits: BenefitProps[] = await fetchBenefits(brandId);
      return benefits;
    },
    enabled: !!brandName, // brandName이 있어야 요청 실행
    staleTime: Infinity,
    retry: 1,
  });
}
