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

  useEffect(() => {
    setIsLogin(modeFromURL !== "signup");
  }, [modeFromURL]);

  const switchAuthModeHandler = () => {
    const newMode = isLogin ? "signup" : "login";
    setIsLogin((prev) => !prev);
    navigate(`/auth?mode=${newMode}`);
    setError(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    const enteredEmail = emailInputRef.current.value.trim();
    const enteredPassword = passwordInputRef.current.value.trim();

    if (!isLogin) {
      const enteredPassword2 = confirmPasswordInputRef.current.value.trim();

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

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Authentication failed!";
        if (data?.error?.message) errorMessage = data.error.message;
        throw new Error(errorMessage);
      }

      if (isLogin) {
        // Lookup to verify email
        const verifyRes = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: data.idToken }),
          }
        );
        const verifyData = await verifyRes.json();
        const emailVerified = verifyData.users?.[0]?.emailVerified || false;

        authCtx.login(data.idToken, emailVerified);
        navigate("/");
      } else {
        // For sign up: send email verification
        authCtx.login(data.idToken, false);
        const verificationSent = await authCtx.sendEmailVerification();
        navigate("/", {
          state: {
            message: verificationSent.success
              ? "Account created! Verification email sent."
              : "Account created. Please verify email later.",
          },
        });
      }
    } catch (err) {
      let errorMsg = err.message;

      if (errorMsg.includes("EMAIL_EXISTS")) {
        errorMsg = "Email already exists. Please login.";
      } else if (errorMsg.includes("EMAIL_NOT_FOUND")) {
        errorMsg = "Email not found. Please sign up.";
      } else if (errorMsg.includes("INVALID_PASSWORD")) {
        errorMsg = "Invalid password. Try again.";
      } else if (errorMsg.includes("TOO_MANY_ATTEMPTS_TRY_LATER")) {
        errorMsg = "Too many attempts. Please try again later.";
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      {error && <p className={classes.error}>*{error}</p>}
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            ref={emailInputRef}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className={classes.control}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            required
            placeholder="Enter your password"
            minLength={6}
          />
        </div>

        {!isLogin && (
          <div className={classes.control}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              ref={confirmPasswordInputRef}
              required
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>
        )}

        <div className={classes.actions}>
          {!isLoading ? (
            <button type="submit" className={classes.login}>
              {isLogin ? "Login" : "Create Account"}
            </button>
          ) : (
            <p className={classes.loading}>Processing...</p>
          )}

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
            {isLogin
              ? "Create New Account"
              : "Already have an account? Login"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
