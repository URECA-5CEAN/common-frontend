import { useState } from 'react';
import UserTotalRanking from '../components/ranking/UserTotalRanking';
import UserStoreRanking from '../components/ranking/UserStoreRanking';

type Tab = {
  title: string;
  content: React.ReactNode;
};

const tabs: Tab[] = [
  { title: '전체', content: <UserTotalRanking /> },
  { title: '매장별', content: <UserStoreRanking /> },
];

const RankingPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full max-w-[1050px] m-6">
      {/* 탭 버튼 */}
      <div>
        {tabs.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`relative cursor-pointer px-5 py-2.5 font-bold text-xl ${activeTab === i ? 'text-[#1CB0F7]' : 'text-gray-300'}`}
          >
            {item.title} 순위
            <span className="absolute bottom-0 left-0 h-[1px] w-full bg-gray-300" />
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
