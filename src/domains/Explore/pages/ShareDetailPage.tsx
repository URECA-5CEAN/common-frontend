import { useParams, useNavigate } from 'react-router-dom';

const ShareDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-[800px] mx-auto px-4 py-6">
      <span>{postId}</span>
    </div>
  );
};

export default ShareDetailPage;
