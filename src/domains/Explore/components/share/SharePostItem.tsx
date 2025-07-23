import type { Post } from '@/domains/Explore/types/share';
import { Calendar } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SharePostItemProps {
  post: Post;
}

const SharePostItem = ({ post }: SharePostItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/explore/share/${post.id}`);
  };
  return (
    <li
      onClick={handleClick}
      className="relative border rounded-xl p-4 border-gray-200 cursor-pointer flex flex-col sm:flex-row justify-between gap-4"
    >
      <button className="absolute right-4 top-4 text-gray-400 ">
        <Heart />
      </button>
      <div className="flex gap-2 sm:gap-4">
        <div className="relative w-16 h-16 sm:w-32 sm:h-32 flex items-center justify-center flex-shrink-0">
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
          <h3 className="text-lg font-bold break-words  pr-10 min-w-0">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-1">{post.content}</p>
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
          <div className="flex flex-wrap sm:hidden text-gray-400 gap-x-1 text-sm">
            <div className="flex gap-1">
              <Calendar size={16} /> {post.date}
            </div>
            <span>·</span>
            <div className="flex gap-1">
              <MapPin size={16} /> {post.place}
            </div>
          </div>
        </div>
      </div>
      <div className="sm:flex hidden sm:flex-col items-end gap-2 justify-end text-gray-400">
        <div className="flex items-center gap-2">
          <Calendar size={20} /> {post.date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={20} /> {post.place}
        </div>
      </div>
    </li>
  );
};

export default SharePostItem;
