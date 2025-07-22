import type { Post } from '@/domains/Explore/types/share';
import { Calendar } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Heart } from 'lucide-react';

interface SharePostItemProps {
  post: Post;
}

const SharePostItem = ({ post }: SharePostItemProps) => {
  const handleClick = () => {
    // 상세페이지 이동
  };

  return (
    <li
      onClick={handleClick}
      className={`border rounded-xl p-4 border-gray-200 cursor-pointer flex justify-between`}
    >
      <div className="flex gap-4">
        <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* <img /> */}
          <div
            className={`bg-gray-400 w-full h-full rounded-2xl ${
              post.isClosed ? 'filter brightness-50' : ''
            }`}
          ></div>
          {post.isClosed && (
            <span className="absolute text-xs font-semibold text-white">
              모집 완료
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{post.title}</h3>

          <p className="text-gray-600 truncate">{post.content}</p>
          <div className="text-sm flex flex-wrap gap-2">
            <span className="bg-yellow-400 px-3.5 py-1 rounded-2xl">
              {post.category}
            </span>
            <span className="bg-red-400 px-3.5 py-1 rounded-2xl">
              {post.brand}
            </span>
            <span className="bg-gray-400 px-3.5 py-1 rounded-2xl">
              {post.type}
            </span>
          </div>
        </div>
      </div>
      <div className="text-gray-400 flex flex-col items-end justify-between h-full">
        <Heart />
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Calendar size={20} /> {post.date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} /> {post.place}
          </div>
        </div>
      </div>
    </li>
  );
};

export default SharePostItem;
