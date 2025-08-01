import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import SharePostList from '@/domains/Explore/components/share/SharePostList';
import type { Post } from '@/domains/Explore/types/share';
import { getMyPostList } from '@/domains/MyPage/api/myShare';
import { getUserInfo } from '@/domains/MyPage/api/profile';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MySharingPage = () => {
  const [myPostList, setMyPostList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        const [postListData, userData] = await Promise.all([
          getMyPostList(),
          getUserInfo(),
        ]);

        const userEmail = userData.data.email;

        const modifiedPostList = postListData.data.map((post: Post) => ({
          ...post,
          isMine: post.author.email === userEmail,
        }));

        setMyPostList(modifiedPostList);
      } catch (error) {
        console.error('내 나눔 로드 실패:', error);
      }
    };

    fetchPostList();
  }, []);

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
      <Breadcrumb title="마이페이지" subtitle="내 나눔" />
      <div className="text-[32px] font-bold my-3">내 나눔</div>

      <div className="flex justify-between gap-4">
        <div className="flex gap-2 flex-1"></div>
        <div className="fixed right-4 bottom-4 sm:static sm:right-auto sm:bottom-auto sm:flex sm:items-center z-10">
          <Button
            variant="primary"
            size="lg"
            className="sm:flex whitespace-nowrap px-4 py-2 rounded-md items-center gap-1"
            onClick={() => navigate('/mypage/share/write')}
          >
            <Plus size={18} />
            <span className="hidden sm:flex">글 작성</span>
          </Button>
        </div>
      </div>

      <SharePostList posts={myPostList} />
    </div>
  );
};

export default MySharingPage;
