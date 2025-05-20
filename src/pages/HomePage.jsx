import { Fragment, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Store/AuthContext";
import StartingPageContent from "../components/StartingPage/StartingPageContent";
import EmailVerificationBanner from "../components/Auth/EmailVerificationBanner";
import classes from "./HomePage.module.css";

const HomePage = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!authCtx.isLoggedIn) return;

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
          setIsProfileComplete(!!user.displayName && !!user.photoUrl);
        }
      } catch (err) {
        console.error("Error checking profile:", err);
      }
    };

    checkProfileCompletion();
  }, [authCtx.isLoggedIn, authCtx.token]);

  const profileHandler = () => {
    navigate("./profile");
  };

  return (
    <Fragment>
      {authCtx.isLoggedIn ? (
        <section className={classes.starting}>
          <EmailVerificationBanner />
          <div className={classes.welcomeHeader}>
            <p>Welcome To Expense Tracker</p>
          </div>
          <div className={classes.profileContainer}>
            <div className={classes.profile}>
              {!isProfileComplete ? (
                <>
                  <p>Your Profile Is Incomplete</p>
                  <button onClick={profileHandler}>Complete Now</button>
                </>
              ) : (
                <>
                  <p>Congratulations! Profile is verified</p>
                  <div className={classes.buttonGroup}>
                    <button onClick={profileHandler}>Update Profile</button>
                    <button onClick={() => navigate("/add-expense")}>Add Expense</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <StartingPageContent />
      )}
    </Fragment>
  );
};

export default HomePage;