import { useState, useRef, useContext } from "react";

import AuthContext from "../../Store/AuthContext";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState();

  const swithcAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredPassword2 = confirmPasswordInputRef.current.value;

    if (
      enteredEmail &&
      enteredPassword &&
      enteredPassword2 &&
      enteredPassword === enteredPassword2
    ) {
      setIsFormValid(true);
    } else {
      if (enteredPassword !== enteredPassword2) {
        setError("Passwords didn't Matched");
        console.log("Passwords didn't Matched");
      } else {
        setError("All Fields Are Required");
        console.log("All Fields Are Required");
      }
      return;
    }

    setIsLoading(true);
    let URL;
    if (isLogin && isFormValid) {
      URL =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8";
    } else {
      URL =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8";
    }
    fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          console.log("User Created");
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentication Failed!";
            throw new Error(errorMessage);
            // alert("Authentication Failed!");
          });
        }
      })
      .then((data) => {
        authCtx.login(data.idToken);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <section className={classes.auth}>
      {error && <p style={{ color: "red", textAlign: "start" }}>*{error}</p>}
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlForm="email">Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          {isLogin && (
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                ref={passwordInputRef}
              />
            </div>
          )}
          {!isLogin && (
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                ref={passwordInputRef}
              />
              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                rerquired
                ref={confirmPasswordInputRef}
              />
            </div>
          )}
        </div>
        <div className={classes.actions}>
          {!isLoading && (
            <button>{isLogin ? "Login" : "Create Account"}</button>
          )}
          {isLoading && <p>Sending Request...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={swithcAuthModeHandler}
          >
            {isLogin ? "Create New Account" : "Have an Account? Login"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;