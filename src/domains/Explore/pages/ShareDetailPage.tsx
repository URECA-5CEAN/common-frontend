import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createChatRoom, getSharePostById } from '../api/share';
import type { Post } from '../types/share';
import { Calendar, ChevronLeft, MapPin, Pencil, Trash2 } from 'lucide-react';
import { fromISOStringToDateTime } from '../utils/datetimeUtils';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { deleteMySharePost } from '@/domains/MyPage/api/myShare';
import dolphinImg from '@/assets/image/dolphin_normal.png';
import { getUserInfo } from '@/domains/MyPage/api/profile';
import { Ring } from 'ldrs/react';
import { Map, CustomOverlayMap, useKakaoLoader } from 'react-kakao-maps-sdk';
import 'ldrs/react/Ring.css';
import CustomMarker from '@/domains/Map/components/CustomMarker';

const ShareDetailPage = () => {
  const { postId = '' } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const navigate = useNavigate();

  useKakaoLoader({ appkey: import.meta.env.VITE_KAKAO_API });

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) return;
      const token = localStorage.getItem('authToken');

      try {
        setIsLoading(true);
        const postData = await getSharePostById(postId);
        let userData;
        if (token) userData = await getUserInfo();
        else userData = null;

        const userEmail = userData?.data.email;
        setIsLoggedIn(!!userEmail);
        const modifiedPost = {
          ...postData,
          isMine: postData.author.email === userEmail,
        };

        setPost(modifiedPost);
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
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!post) return;

    try {
      const data = await createChatRoom(post.postId);

      const chatRoomId = data.data.chatRoomId;

      navigate(`/chat?roomId=${chatRoomId}`);
    } catch (error) {
      console.error('채팅방 생성 실패:', error);
    }
  };

  const handleEditClick = () => {
    navigate(`/explore/share/edit/${postId}`);
  };

  const handleDeleteClick = async () => {
    try {
      setIsConfirmLoading(true);
      await deleteMySharePost(postId);
      navigate(`/explore/share`);
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    } finally {
      setIsConfirmLoading(false);
    }
  };

  return (
    <div className="w-[calc(100%-48px)] md:w-[80%] max-w-[1050px] mb-50 md:mb-100">
      <button
        className="w-10 h-10 mb-4 cursor-pointer"
        onClick={() => navigate(-1)}
        aria-label="뒤로가기"
      >
        <ChevronLeft size={40} />
      </button>
      <div className="flex flex-col gap-5">
        <div className="flex gap-4 sm:items-center">
          <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
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
                <MapPin size={20} /> {post.storeName}
              </div>
            </div>
            <div className="text-gray-400">
              {post.category} · {post.brandName} · {post.benefitName}
            </div>
          </div>
        </div>

        <p className="text-gray-600">{post.content}</p>
        {post.storeLatitude && post.storeLongitude && (
          <div className="mt-6 rounded-xl overflow-hidden w-full h-52">
            <Map
              center={{ lat: post.storeLatitude, lng: post.storeLongitude }}
              style={{ width: '100%', height: '100%' }}
              level={3}
              draggable={false}
              zoomable={false}
            >
              {/* 마커 */}
              <CustomMarker
                id={post.postId}
                lat={post.storeLatitude}
                lng={post.storeLongitude}
                name={post.storeName}
                imageUrl={post.brandImgUrl}
                selected={true} // 상세페이지니까 항상 true로 강조
                isRecommended={undefined}
                onClick={() => {}}
                onMouseEnter={() => {}}
                onMouseLeave={() => {}}
                shouldCluster={false}
              />

              {/* 커스텀 오버레이 */}
              <CustomOverlayMap
                position={{ lat: post.storeLatitude, lng: post.storeLongitude }}
                yAnchor={1}
              ></CustomOverlayMap>
            </Map>
          </div>
        )}
        <div className="flex justify-end">
          {post.isMine ? (
            <>
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
            </>
          ) : (
            <Button onClick={handleStartChat}>채팅 시작하기</Button>
          )}
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
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        img={
          <div className="w-full flex justify-center items-center">
            <img src={dolphinImg} alt="돌고래 캐릭터" className="w-30 h-30" />
          </div>
        }
        title="로그인 후 이용 가능합니다"
        description="채팅 기능을 사용하려면 로그인이 필요합니다."
        actions={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsLoginModalOpen(false)}
            >
              닫기
            </Button>
            <Button
              fullWidth
              onClick={() => navigate('/login')} // 로그인 페이지로 이동
            >
              로그인하기
            </Button>
          </>
        }
      />
    </div>
  );
};

export default ShareDetailPage;
