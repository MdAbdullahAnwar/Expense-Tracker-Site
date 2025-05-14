import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AuthContext from "../../Store/AuthContext";
import ThemeToggle from "../Theme/ThemeToggle";
import classes from "./MainNavigation.module.css";
import { FiSun, FiMoon } from "react-icons/fi";
import { toggleTheme } from "../../Store/store/themeSlice";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const isLoggedIn = authCtx.isLoggedIn;

  const { isPremiumActivated } = useSelector((state) => state.expenses);
  const darkMode = useSelector((state) => state.theme.darkMode);

  useEffect(() => {
    if (!isLoggedIn) {
      setUserData(null);
      return;
    }

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
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (data.users && data.users.length > 0) {
          setUserData(data.users[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [isLoggedIn, authCtx.token]);

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
              <button onClick={toggleAuthModeHandler} className={classes.authButton}>
                {location.search.includes("signup") ? "Login" : "Sign Up"}
              </button>
            </li>
          )}

          {isLoggedIn && (
            <>
              <li className={classes.desktopOnly}>
                <Link to="/profile">Profile</Link>
              </li>
              <li className={classes.desktopOnly}>
                <Link to="/add-expense">Expenses</Link>
              </li>
              {isPremiumActivated && (
                <>
                  <li className={classes.desktopOnly}>
                    <ThemeToggle />
                  </li>
                  <li className={classes.mobileOnly}>
                    {darkMode ? (
                      <FiSun className={classes.themeIcon} onClick={() => dispatch(toggleTheme())} />
                    ) : (
                      <FiMoon className={classes.themeIcon} onClick={() => dispatch(toggleTheme())} />
                    )}
                  </li>
                </>
              )}
              <li className={`${classes.userInfo} ${classes.mobileCompact}`}>
                <button onClick={logoutHandler} className={classes.mobileLogout}>
                  Logout
                </button>
                {userData?.photoUrl && (
                  <img
                    src={userData.photoUrl}
                    alt="Profile"
                    className={classes.profileImage}
                  />
                )}
              </li>
              {/* Show user's display name on desktop */}
              {userData?.displayName && (
                <li className={`${classes.desktopOnly} ${classes.userName}`}>
                  {userData.displayName}
                </li>
              )}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;