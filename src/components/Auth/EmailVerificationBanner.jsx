import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../Store/AuthContext';
import classes from './EmailVerificationBanner.module.css';

const EmailVerificationBanner = () => {
  const authCtx = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    // Check email verification status when component mounts
    if (authCtx.isLoggedIn && !authCtx.isEmailVerified) {
      authCtx.checkEmailVerification();
    }
  }, [authCtx]);

  const verifyEmailHandler = async () => {
    setIsLoading(true);
    setMessage('');
    
    const result = await authCtx.sendEmailVerification();
    
    setMessage(result.message);
    setIsLoading(false);
    
    // Re-check verification status after sending email
    if (result.success) {
      setTimeout(() => {
        authCtx.checkEmailVerification();
      }, 5000); // Check after 5 seconds
    }
  };

  if (!authCtx.isLoggedIn || authCtx.isEmailVerified || !showBanner) {
    return null;
  }

  return (
    <div className={classes.banner}>
      <div className={classes.content}>
        <p>Your email is not verified. Please verify your email to secure your account.</p>
        {message && <p className={message.includes('success') ? classes.success : classes.error}>{message}</p>}
        <div className={classes.actions}>
          <button 
            onClick={verifyEmailHandler} 
            disabled={isLoading}
            className={classes.button}
          >
            {isLoading ? 'Sending...' : 'Verify Email'}
          </button>
          <button 
            onClick={() => setShowBanner(false)} 
            className={classes.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;