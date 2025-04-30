import { useRef, useContext, useState } from "react";
import AuthContext from "../../Store/AuthContext";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const [feedback, setFeedback] = useState(null);

  const submitHandler = async (event) => {
    event.preventDefault();
    const enteredNewPassword = newPasswordInputRef.current.value;

    if (enteredNewPassword.trim().length < 6) {
        setFeedback("Password must be at least 6 characters.");
        return;
    }

    try {
      const response = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
            password: enteredNewPassword,
            returnSecureToken: false,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        let errorMessage = "Password update failed.";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
        }
        throw new Error(errorMessage);
      }

      setFeedback("Password updated successfully!");
    } catch (err) {
      setFeedback(err.message);
    }
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="6"
          ref={newPasswordInputRef}
          required
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
      {feedback && (
        <p style={{ color: feedback.includes("successfully") ? "green" : "red" }}>
          {feedback}
        </p>
      )}
    </form>
  );
};

export default ProfileForm;
