import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { createChatRoom } from '../api/share';

interface Post {
  id: string;
  title: string;
  writerId: string;
}

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
