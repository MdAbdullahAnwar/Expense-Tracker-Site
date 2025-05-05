import React, { useState, useEffect } from "react";

const AuthContext = React.createContext({
  token: "",
  userId: "",
  isLoggedIn: false,
  isEmailVerified: false,
  login: (token, userId, emailVerified) => {},
  logout: () => {},
  sendEmailVerification: () => Promise.resolve({ success: false, message: "" }),
  checkEmailVerification: () => Promise.resolve(false),
});

export const AuthContextProvider = (props) => {
  const initialState = localStorage.getItem("token");
  const initialUserId = localStorage.getItem("userId");
  const initialEmailVerified = localStorage.getItem("emailVerified") === 'true';
  const [token, setToken] = useState(initialState);
  const [userId, setUserId] = useState(initialUserId);
  const [isEmailVerified, setIsEmailVerified] = useState(initialEmailVerified);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, userId, emailVerified = false) => {
    setToken(token);
    setUserId(userId);
    setIsEmailVerified(emailVerified);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("emailVerified", emailVerified);
  };

  const logoutHandler = () => {
    setToken(null);
    setUserId(null);
    setIsEmailVerified(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("emailVerified");
  };

  const sendEmailVerificationHandler = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestType: "VERIFY_EMAIL",
            idToken: token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Failed to send verification email");
      }

      return { success: true, message: "Verification email sent! Please check your inbox." };
    } catch (error) {
      let errorMessage = "Failed to send verification email";
      if (error.message.includes("INVALID_ID_TOKEN")) {
        errorMessage = "Session expired. Please login again.";
      } else if (error.message.includes("USER_NOT_FOUND")) {
        errorMessage = "User not found. Please register first.";
      }
      return { success: false, message: errorMessage };
    }
  };

  const checkEmailVerificationHandler = async () => {
    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: token,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message || "Failed to check email verification status");
      }

      if (data.users && data.users.length > 0) {
        const verified = data.users[0].emailVerified || false;
        setIsEmailVerified(verified);
        localStorage.setItem("emailVerified", verified);
        return verified;
      }
      return false;
    } catch (error) {
      console.error("Error checking email verification:", error);
      return false;
    }
  };

  useEffect(() => {
    let logoutTimer;

    if (userIsLoggedIn) {
      logoutTimer = setTimeout(() => {
        logoutHandler();
        alert("You have been logged out due to inactivity.");
      }, 5 * 60 * 1000);
    }
    return () => clearTimeout(logoutTimer);
  }, [userIsLoggedIn]);

  const contextValue = {
    token: token,
    userId: userId,
    isLoggedIn: userIsLoggedIn,
    isEmailVerified: isEmailVerified,
    login: loginHandler,
    logout: logoutHandler,
    sendEmailVerification: sendEmailVerificationHandler,
    checkEmailVerification: checkEmailVerificationHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;