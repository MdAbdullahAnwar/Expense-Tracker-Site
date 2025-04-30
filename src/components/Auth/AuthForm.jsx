import { useState, useRef, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AuthContext from "../../Store/AuthContext";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const modeFromURL = queryParams.get("mode");

  const [isLogin, setIsLogin] = useState(modeFromURL !== "signup");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update mode when URL query param changes
  useEffect(() => {
    setIsLogin(modeFromURL !== "signup");
  }, [modeFromURL]);

  const switchAuthModeHandler = () => {
    const newMode = isLogin ? "signup" : "login";
    setIsLogin((prevState) => !prevState);
    navigate(`/auth?mode=${newMode}`);
    setError(null);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError(null);

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    if (!isLogin) {
      const enteredPassword2 = confirmPasswordInputRef.current.value;

      if (!enteredEmail || !enteredPassword || !enteredPassword2) {
        setError("All fields are required.");
        return;
      }

      if (enteredPassword !== enteredPassword2) {
        setError("Passwords didn't match.");
        return;
      }
    }

    setIsLoading(true);

    const URL = isLogin
      ? "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8"
      : "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8";

    try {
      const response = await fetch(URL, {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      setIsLoading(false);

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Authentication Failed!";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      authCtx.login(data.idToken);
      navigate("/");
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    const email = emailInputRef.current.value;
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

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
            email: email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Failed to send reset link.";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      alert("Password reset link sent! Please check your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {error && <p style={{ color: "red", textAlign: "start" }}>*{error}</p>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>

        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" required ref={passwordInputRef} />
        </div>

        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              required
              ref={confirmPasswordInputRef}
            />
          </div>
        )}

        <div className={classes.actions}>
          {!isLoading && (
            <button className={classes.login}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          )}
          {isLoading && <p>Sending Request...</p>}

          {isLogin && (
            <button
              type="button"
              className={classes.forgot}
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          )}

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create New Account" : "Have an Account? Login"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;