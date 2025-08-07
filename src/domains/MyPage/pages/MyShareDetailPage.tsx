import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Post } from '@/domains/Explore/types/share';
import { getSharePostById } from '@/domains/Explore/api/share';
import { fromISOStringToDateTime } from '@/domains/Explore/utils/datetimeUtils';
import { Calendar, ChevronLeft, MapPin, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';
import dolphinImg from '@/assets/image/dolphin_normal.png';
import dolphinFind from '@/assets/image/dolphin_find.png';
import { deleteMySharePost } from '@/domains/MyPage/api/myShare';
import { Ring } from 'ldrs/react';
import 'ldrs/react/Ring.css';

const MyShareDetailPage = () => {
  const { postId = '' } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleEditClick = () => {
    navigate(`/mypage/share/edit/${postId}`);
  };
  const handleDeleteClick = async () => {
    try {
      setIsConfirmLoading(true);
      await deleteMySharePost(postId);
      navigate(`/mypage/share`);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  if (isLoading) return <div className="m-6">로딩 중...</div>;
  if (!post)
    return (
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] flex flex-col gap-5  mb-50 md:mb-100">
        <button
          className="w-10 h-10 mb-4 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={40} />
        </button>
        <div className="w-full h-[400px] flex flex-col gap-5 items-center justify-center text-center">
          <img
            src={dolphinFind}
            alt="무언가를 찾는 돌고래"
            className="w-40 h-40"
          />
          내 나눔 게시글을 조회할 수 없어요.
          <br />
          잠시 후 다시 시도해주세요.
        </div>
      </div>
    );

  const dateTime = fromISOStringToDateTime(post.promiseDate);

  return (
    <>
      <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
        <button
          className="w-10 h-10 mb-4 cursor-pointer"
          onClick={() => navigate(-1)}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={40} />
        </button>
        <div className="flex gap-4 sm:items-center">
          <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
            {/* <img /> */}
            {post.brandImgUrl ? (
              <img
                src={post.brandImgUrl}
                alt="브랜드 이미지"
                className="rounded-2xl"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-2xl" />
            )}
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
          <div
            className="p-2 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-100 text-gray-400 hover:text-gray-500"
            onClick={() => setIsOpen(true)}
          >
            <Trash2 />
          </div>
          <div
            className="p-2 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-100 text-gray-400 hover:text-gray-500"
            onClick={handleEditClick}
          >
            <Pencil />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        img={
          <div className="w-full flex justify-center items-center">
            <img src={dolphinImg} alt="돌고래 캐릭터" className="w-30 h-30" />
          </div>
        }
        title="정말 삭제하시겠어요?"
        description="삭제된 글은 다시 볼 수 없어요"
        actions={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
            <Button
              fullWidth
              onClick={() => handleDeleteClick()}
              disabled={isConfirmLoading}
              loading={isConfirmLoading}
            >
              {isConfirmLoading ? (
                <div className="flex">
                  <Ring
                    size="24"
                    stroke="3"
                    bgOpacity="0"
                    speed="2"
                    color="white"
                  />
                </div>
              ) : (
                '삭제하기'
              )}
            </Button>
          </>
        }
      ></Modal>
    </>
  );
};

export default MyShareDetailPage;
