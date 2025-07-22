import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <div className="h-[1500px] pt-[62px] md:pt-[86px] bg-primaryGreen">
      LoginPage
      <div className="mb-4">
        <Button onClick={handleSignUpClick} variant="primary" size="lg">
          회원가입
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
