import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSharePostById } from '../api/share';
import type { Post } from '../types/share';
import { Calendar, MapPin } from 'lucide-react';
import { fromISOStringToDateTime } from '../utils/datetimeUtils';
import { Button } from '@/components/Button';

const ShareDetailPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        const data = await getSharePostById(postId);
        setPost(data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (isLoading) return <div className="m-6">로딩 중...</div>;
  if (!post) return null;

  const dateTime = fromISOStringToDateTime(post.promiseDate);

  const handleStartChat = async () => {
    console.log(post.postId);
  };

  return (
    <div className="w-full max-w-[1050px] m-6 flex flex-col gap-5">
      <div className="flex gap-4 sm:items-center">
        <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
          {/* <img /> */}
          <div className={`bg-gray-400 w-full h-full rounded-2xl`}></div>
          {/* {post.isClosed && (
            <span className="absolute text-xs font-semibold text-white">
              모집 완료
            </span>
          )} */}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <span>{post.author.nickname}</span>

          <div className="flex gap-2 flex-wrap">
            <div className="text-gray-500 flex gap-1">
              <Calendar size={20} />
              {`${dateTime.date}, ${dateTime.time.period} ${dateTime.time.hour}:${dateTime.time.minute}`}
            </div>
            <div className="text-gray-500 flex gap-1">
              <MapPin size={20} /> {post.location}
            </div>
          </div>
          <div className="text-gray-400">
            {post.category} · {post.brandName} · {post.benefitName}
          </div>
        </div>
      </div>
      <p className="text-gray-600">{post.content}</p>

      <div className="flex justify-end">
        <Button onClick={handleStartChat}>채팅 시작하기</Button>
      </div>
    </div>
  );
};

export default ShareDetailPage;
