import type { Post } from '@/domains/Explore/types/share';
import { Calendar, Trash2 } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fromISOStringToDateTime } from '../../utils/datetimeUtils';

interface SharePostItemProps {
  post: Post;
}

const SharePostItem = ({ post }: SharePostItemProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    if (!post) return;

    if (post.isMine) {
      navigate(`/mypage/share/${post.postId}`);
    } else {
      navigate(`/explore/share/${post.postId}`);
    }
  };
  const dateTime = fromISOStringToDateTime(post.promiseDate);

  return (
    <li
      onClick={handleClick}
      className="relative border rounded-xl p-4 border-gray-200 cursor-pointer flex flex-col sm:flex-row justify-between gap-4"
    >
      <button className="absolute right-4 top-4 text-gray-400 ">
        {pathname === '/mypage/sharing' && <Trash2 />}
      </button>
      <div className="flex gap-2 sm:gap-4">
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
          <h3 className="text-lg font-bold break-words  pr-10 min-w-0">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-1">{post.content}</p>
          <div className="text-sm flex flex-wrap gap-1 text-gray-300">
            {post.category} · {post.brandName} · {post.benefitName}
          </div>
          <div className="flex flex-wrap sm:hidden text-gray-400 gap-x-1 text-sm">
            <div className="flex gap-1">
              <Calendar size={16} />
              {`${dateTime.date}, ${dateTime.time.period} ${dateTime.time.hour}:${dateTime.time.minute}`}
            </div>
            <span>·</span>
            <div className="flex gap-1">
              <MapPin size={16} /> {post.location}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex hidden sm:flex-col items-end gap-2 justify-end text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          {`${dateTime.date}, ${dateTime.time.period} ${dateTime.time.hour}:${dateTime.time.minute}`}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={20} /> {post.location}
        </div>
      </div>
    </li>
  );
};

export default SharePostItem;
