import { useRef, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../Store/AuthContext";
import classes from "./ProfileForm.module.css";

const ProfileForm = () => {
  const fullNameInputRef = useRef();
  const profileUrlInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDz3WFPJfsv9G0Fb7xB4V8yrN4YECxhdG8",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idToken: authCtx.token,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        if (data.users && data.users.length > 0) {
          const user = data.users[0];
          if (fullNameInputRef.current) {
            fullNameInputRef.current.value = user.displayName || "";
          }
          if (profileUrlInputRef.current) {
            profileUrlInputRef.current.value = user.photoUrl || "";
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authCtx.token]);

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

        // Don't clear the inputs after update
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

  if (isLoading) {
    return <div className={classes.loading}>Loading profile data...</div>;
  }

  if (error) {
    return <div className={classes.error}>Error: {error}</div>;
  }

  return (
    <div>
      <form className={classes.form} onSubmit={updateProfile}>
        <div className={classes.control}>
          <label htmlFor="full-name">Full Name</label>
          <input type="text" id="full-name" ref={fullNameInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="photo-url">Profile Photo URL</label>
          <input type="text" id="photo-url" ref={profileUrlInputRef} required />
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