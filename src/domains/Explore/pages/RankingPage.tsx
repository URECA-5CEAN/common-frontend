import { useState } from 'react';
import UserTotalRanking from '@/domains/Explore/components/ranking/UserTotalRanking';
import StoreRanking from '@/domains/Explore/components/ranking/StoreRanking';
import { Breadcrumb } from '@/components/Breadcrumb';

type Tab = {
  title: string;
  content: React.ReactNode;
};

const tabs: Tab[] = [
  { title: '전체', content: <UserTotalRanking /> },
  { title: '매장별', content: <StoreRanking /> },
];

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
      <Breadcrumb title="혜택탐험" subtitle="혜택 순위" />
      {/* 탭 버튼 */}
      <div className="mt-3">
        {tabs.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`relative cursor-pointer px-5 py-2.5 font-bold text-xl ${activeTab === i ? 'text-[#1CB0F7]' : 'text-gray-300'}`}
          >
            {item.title} 순위
            <span className="absolute bottom-0 left-0 h-[1px] w-full " />
            <span
              className={`absolute bottom-0 h-0.5 transition-all duration-400 bg-[#1CB0F7] ${activeTab === i ? 'left-0 w-full translate-x-0' : 'left-1/2 w-0 -translate-x-1/2'}`}
            />
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <section>{tabs[activeTab].content}</section>
    </div>
  );
};

export default RankingPage;
