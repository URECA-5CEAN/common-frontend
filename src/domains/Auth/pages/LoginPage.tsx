import { useState } from 'react';
import SignUpPage from './SignUpPage';
import { Button } from '../../../components/Button';

const LoginPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowSignUp(false);
  };

  if (showSignUp) {
    return <SignUpPage onBackToLogin={handleBackToLogin} />;
  }

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
