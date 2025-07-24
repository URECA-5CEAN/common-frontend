import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import type { Post } from '@/domains/Explore/types/share';
import SharePostList from '@/domains/Explore/components/share/SharePostList';
import { useNavigate } from 'react-router-dom';

// 임의 데이터
const postList: Post[] = [
  {
    id: '1',
    title: '롯데월드 자유이용권 1+1 나눠요!',
    content: '혼자 가기 아쉬워서 같이 가실 분 구해요 :)',
    category: '테마파크',
    brand: '롯데월드',
    type: '1+1 나눔',
    date: '7/12, 17:00',
    place: '롯데월드 정문 앞',
    isClosed: false,
  },
  {
    id: 'b11703b5-b31d-465f-8234-1d2fccf3383f',
    title: 'CGV 영화 티켓 1장 나눔',
    content: '시간 맞는 분께 드릴게요. 선착순!',
    category: '영화',
    brand: 'CGV',
    type: '티켓 나눔',
    date: '7/13, 19:00',
    place: 'CGV 강남점',
    isClosed: false,
  },
  {
    id: '3',
    title: '메가박스 팝콘 교환권 같이 쓰실 분!',
    content: '영화 볼 분 없어도 괜찮아요, 팝콘 나눔 원해요!',
    category: '영화',
    brand: '메가박스',
    type: '혜택 공유',
    date: '7/14, 15:00',
    place: '메가박스 코엑스점',
    isClosed: false,
  },
  {
    id: '4',
    title: '에버랜드 연간회원권 동반 할인 받아요',
    content: '하루만 동반으로 들어가실 분 구해요!',
    category: '테마파크',
    brand: '에버랜드',
    type: '동반 할인',
    date: '7/15, 10:00',
    place: '에버랜드 입구',
    isClosed: true,
  },
  {
    id: '5',
    title: 'CGV 2인 예매권 나눔합니다',
    content: '영화 좋아하는 분 환영이에요',
    category: '영화',
    brand: 'CGV',
    type: '1+1 나눔',
    date: '7/16, 20:00',
    place: 'CGV 용산점',
    isClosed: false,
  },
  {
    id: '6',
    title: '롯데시네마 친구 구해요!',
    content: '한 장 남아서 같이 보실 분!',
    category: '영화',
    brand: '롯데시네마',
    type: '티켓 나눔',
    date: '7/17, 18:30',
    place: '롯데시네마 건대입구점',
    isClosed: false,
  },
  {
    id: '7',
    title: '서울랜드 1+1 쿠폰 함께 써요',
    content: '재밌게 놀고 나눔도 해요 :)',
    category: '테마파크',
    brand: '서울랜드',
    type: '1+1 나눔',
    date: '7/18, 13:00',
    place: '서울랜드 정문',
    isClosed: true,
  },
  {
    id: '8',
    title: 'CGV 영화 예매권 1장 나눔',
    content: '선착순이에요! 바로 드릴게요',
    category: '영화',
    brand: 'CGV',
    type: '티켓 나눔',
    date: '7/19, 16:00',
    place: 'CGV 수유점',
    isClosed: false,
  },
  {
    id: '9',
    title: '에버랜드 동반 할인 해요!',
    content: '가족 동반도 환영합니다 :)',
    category: '테마파크',
    brand: '에버랜드',
    type: '동반 할인',
    date: '7/20, 11:00',
    place: '에버랜드 입구',
    isClosed: false,
  },
  {
    id: '10',
    title: 'CGV 1+1 나눔 같이 써요',
    content: '시간 맞는 분 구해요!',
    category: '영화',
    brand: 'CGV',
    type: '1+1 나눔',
    date: '7/21, 21:00',
    place: 'CGV 명동점',
    isClosed: true,
  },
  {
    id: '11',
    title: '롯데월드 입장권 나눔합니다',
    content: '이번 주말 나들이 원하시는 분!',
    category: '테마파크',
    brand: '롯데월드',
    type: '티켓 나눔',
    date: '7/22, 14:00',
    place: '롯데월드 지하 입구',
    isClosed: false,
  },
  {
    id: '12',
    title: '메가박스 친구 구해요!',
    content: '팝콘도 같이 먹어요~',
    category: '영화',
    brand: '메가박스',
    type: '혜택 공유',
    date: '7/23, 17:00',
    place: '메가박스 홍대점',
    isClosed: false,
  },
  {
    id: '13',
    title: '서울랜드 1+1 나눔 구해요',
    content: '친구랑 같이 가실 분',
    category: '테마파크',
    brand: '서울랜드',
    type: '1+1 나눔',
    date: '7/24, 10:30',
    place: '서울랜드 매표소 앞',
    isClosed: false,
  },
  {
    id: '14',
    title: '롯데시네마 2인 예매권 함께 써요',
    content: '좋은 영화 같이 봐요!',
    category: '영화',
    brand: '롯데시네마',
    type: '1+1 나눔',
    date: '7/25, 19:30',
    place: '롯데시네마 노원점',
    isClosed: false,
  },
  {
    id: '15',
    title: 'CGV 티켓 한 장 나눔 (급구)',
    content: '오늘 시간 가능하신 분!',
    category: '영화',
    brand: 'CGV',
    type: '티켓 나눔',
    date: '7/26, 15:00',
    place: 'CGV 왕십리점',
    isClosed: false,
  },
];

const SharePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1050px] mx-auto px-6 sm:px-0">
      <h2 className="text-[32px] font-bold mb-4">혜택 나누기</h2>

      <div className="flex justify-between gap-4">
        <div className="flex gap-2 flex-1">
          <select className="border rounded-2xl p-4 border-gray-200 text-gray-600">
            <option value="역삼동">역삼동</option>
            <option value="청담동">청담동</option>
            <option value="대치동">대치동</option>
          </select>
          <input
            type="text"
            className="flex-1 border rounded-2xl px-4 py-1 border-gray-200"
            placeholder="검색"
          />
        </div>
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

export default SharePage;
