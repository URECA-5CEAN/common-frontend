import { useParams } from 'react-router-dom';

const ShareDetailPage = () => {
  const { postId } = useParams();

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <span>{postId}</span>
    </div>
  );
};

export default ShareDetailPage;
