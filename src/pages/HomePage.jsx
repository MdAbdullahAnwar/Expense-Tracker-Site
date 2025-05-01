import { Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../Store/AuthContext";
import StartingPageContent from "../components/StartingPage/StartingPageContent"; 
import classes from "./HomePage.module.css";

const HomePage = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();
  
    const profileHandler = () => {
      navigate("./profile");
    };
  
    return (
        <Fragment>
            {authCtx.isLoggedIn ? (
            <section className={classes.starting}>
                <div className={classes.welcomeHeader}>
                <p>Welcome To Expense Tracker</p>
                </div>
                <div className={classes.profileContainer}>
                <div className={classes.profile}>
                    <p>Your Profile Is Incomplete</p>
                    <button onClick={profileHandler}>Complete Now</button>
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