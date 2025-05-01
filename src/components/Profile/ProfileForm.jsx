import { useRef, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthContext from "../../Store/AuthContext";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const fullNameInputRef = useRef();
  const profileUrlInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");

  const cancelHandler = () => {
    navigate("/");
  };

  const updateProfile = (event) => {
    event.preventDefault();

    const enteredName = fullNameInputRef.current.value;
    const enteredPhotoURL = profileUrlInputRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: authCtx.token,
          displayName: enteredName,
          photoUrl: enteredPhotoURL,
          returnSecureToken: true,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Profile Update Failed.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Profile Updated:", data);
        setSuccessMessage("Profile Updated Successfully!");

        fullNameInputRef.current.value = "";
        profileUrlInputRef.current.value = "";

        // Redirect to homepage after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((error) => {
        console.error("Error Updating Profile:", error);
        setSuccessMessage("Failed To Update Profile.");
      });
  };

  return (
    <div>
      <form className={classes.form} onSubmit={updateProfile}>
        <div className={classes.control}>
          <label htmlFor="full-name">Full Name</label>
          <input type="text" id="full-name" ref={fullNameInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="photo-url">Profile Photo URL</label>
          <input
            type="text"
            id="photo-url"
            ref={profileUrlInputRef}
            required
          />
        </div>
        <div className={classes.action}>
          <button type="submit" className={classes.update}>
            Update
          </button>
          <button onClick={cancelHandler} className={classes.cancel}>
            Cancel
          </button>
        </div>
      </form>
      {successMessage && <p className={classes.success}>{successMessage}</p>}
    </div>
  );
};

export default ProfileForm;