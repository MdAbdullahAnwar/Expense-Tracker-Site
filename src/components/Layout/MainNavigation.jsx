import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import AuthContext from "../../Store/AuthContext";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
    navigate("/auth?mode=login");
  };

  const toggleAuthModeHandler = () => {
    const currentMode = new URLSearchParams(location.search).get("mode");
    const newMode = currentMode === "signup" ? "login" : "signup";
    navigate(`/auth?mode=${newMode}`);
  };

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>Expense Tracker</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && (
            <li>
              <button onClick={toggleAuthModeHandler}>
                {location.search.includes("signup") ? "Login" : "Sign Up"}
              </button>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;