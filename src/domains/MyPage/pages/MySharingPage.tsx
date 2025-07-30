import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import SharePostList from '@/domains/Explore/components/share/SharePostList';
import type { Post } from '@/domains/Explore/types/share';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 임의 데이터
const postList: Post[] = [
  {
    postId: '1',
    title: '롯데월드 자유이용권 1+1 나눠요!',
    content: '혼자 가기 아쉬워서 같이 가실 분 구해요 :)',
    author: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: '신짱구',
      email: 'jjanggu@example.com',
      address: '서울특별시 강남구',
      gender: 'male',
      title: '액션가면',
      membership: 'vvip',
      nickname: 'shinjjanggu01',
    },
    category: '테마파크',
    brandName: '롯데월드',
    benefitName: '1+1 나눔',
    promiseDate: '7/12, 17:00',
    location: '롯데월드 정문 앞',
    // isClosed: false,
  },
  {
    postId: 'b11703b5-b31d-465f-8234-1d2fccf3383f',
    title: 'CGV 영화 티켓 1장 나눔',
    content: '시간 맞는 분께 드릴게요. 선착순!',
    author: {
      id: 'b3d3d2e0-3d5f-4c09-a6b4-14f6f94b4b33',
      name: '훈이',
      email: 'hunny@example.com',
      address: '서울특별시 강남구',
      gender: 'male',
      title: '주먹밥 머리',
      membership: 'vip',
      nickname: 'hunny',
    },
    category: '영화',
    brandName: 'CGV',
    benefitName: '티켓 나눔',
    promiseDate: '7/13, 19:00',
    location: 'CGV 강남점',
    // isClosed: false,
  },
  {
    postId: '3',
    title: '메가박스 팝콘 교환권 같이 쓰실 분!',
    content: '영화 볼 분 없어도 괜찮아요, 팝콘 나눔 원해요!',
    author: {
      id: '72c9a5b2-7cb4-4e0d-9d30-91b70e5b3c22',
      name: '맹구',
      email: 'mangoo@example.com',
      address: '서울특별시 강남구',
      gender: 'male',
      title: '돌멩이 수집가',
      membership: 'vip',
      nickname: 'loverock',
    },
    category: '영화',
    brandName: '메가박스',
    benefitName: '혜택 공유',
    promiseDate: '7/14, 15:00',
    location: '메가박스 코엑스점',
    // isClosed: false,
  },
];

const MySharingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[calc(100%-48px)] max-w-[1050px] m-6">
      <Breadcrumb title="마이페이지" subtitle="내 나눔" />
      <div className="text-[32px] font-bold my-3">내 나눔</div>

      <div className="flex justify-between gap-4">
        <div className="flex gap-2 flex-1"></div>
        <div className="fixed right-4 bottom-4 sm:static sm:right-auto sm:bottom-auto sm:flex sm:items-center z-10">
          <Button
            variant="primary"
            size="lg"
            className="sm:flex whitespace-nowrap px-4 py-2 rounded-md items-center gap-1"
            onClick={() => navigate('/explore/share/write')}
          >
            <Plus size={18} />
            <span className="hidden sm:flex">글 작성</span>
          </Button>
        </div>
      </div>

      <SharePostList posts={postList} />
    </div>
  );
};

export default MySharingPage;
