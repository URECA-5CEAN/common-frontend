import { useParams, useNavigate } from 'react-router-dom';

const ShareDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1050px] m-6">
      <span>{postId}</span>
    </div>
  );
};

export default ShareDetailPage;
