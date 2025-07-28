import { useParams } from 'react-router-dom';

const ShareDetailPage = () => {
  const { postId } = useParams();

  return (
    <div className="w-full max-w-[1050px] m-6">
      <span>{postId}</span>
    </div>
  );
};

export default ShareDetailPage;
