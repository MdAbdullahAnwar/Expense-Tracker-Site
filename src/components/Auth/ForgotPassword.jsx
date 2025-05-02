import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./ForgotPassword.module.css";
import passwordResetImage from "../../assets/Images/ForgotPassword.png";

const ForgotPassword = () => {
  const emailInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const enteredEmail = emailInputRef.current.value.trim();

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "PASSWORD_RESET",
            email: enteredEmail,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to send password reset email";
        if (data?.error?.message) {
          if (data.error.message.includes("EMAIL_NOT_FOUND")) {
            errorMessage = "No account found with this email address";
          } else {
            errorMessage = data.error.message;
          }
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <img 
          src={passwordResetImage} 
          alt="Password reset" 
          className={classes.image}
        />
      </div>
      <div className={classes.formContainer}>
        <h2>Reset Your Password</h2>
        {success ? (
          <div className={classes.success}>
            <p>Password reset link sent! Please check your email.</p>
            <button
              className={classes.backButton}
              onClick={() => navigate("/auth?mode=login")}
            >
              Back to Login
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={submitHandler}>
              <div className={classes.control}>
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  required
                  ref={emailInputRef}
                  placeholder="Enter your registered email"
                  className={classes.input}
                  disabled={isLoading}
                />
              </div>
              {error && <p className={classes.error}>{error}</p>}
              <div className={classes.actions}>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={classes.button}
                >
                  {isLoading ? (
                    <span className={classes.loaderContainer}>
                      <span className={classes.loader}></span>
                      Sending...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
            <button
              className={classes.backButton}
              onClick={() => navigate("/auth?mode=login")}
              disabled={isLoading}
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;