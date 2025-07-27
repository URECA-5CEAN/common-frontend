import { Plus } from 'lucide-react';
import { Button } from '@/components/Button';
import type { Post } from '@/domains/Explore/types/share';
import SharePostList from '@/domains/Explore/components/share/SharePostList';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSharePostList } from '../api/share';

const SharePage = () => {
  const [postList, setPostList] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const data = await getSharePostList();
        setPostList(data);
      } catch (error) {
        console.error('게시글 목록 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-full max-w-[1050px] m-6">
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

      {isLoading ? (
        <div className="py-10 text-center text-gray-400">불러오는 중...</div>
      ) : (
        <SharePostList posts={postList} />
      )}
    </div>
  );
};

export default SharePage;
