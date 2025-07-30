import type { Post } from '@/domains/Explore/types/share';
import SharePostItem from './SharePostItem';

interface SharePostListProps {
  posts: Post[];
}

const SharePostList = ({ posts }: SharePostListProps) => {
  if (posts.length === 0) {
    return <p className="mt-6 text-center text-gray-500">게시글이 없습니다.</p>;
  }

  return (
    <ul className="flex flex-col gap-4 mt-6 ">
      {posts.map((post) => (
        <SharePostItem key={post.postId} post={post} />
      ))}
    </ul>
  );
};

export default SharePostList;
