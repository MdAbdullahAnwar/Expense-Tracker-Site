import { Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../Store/AuthContext";

const ProtectedRoute = ({ children }) => {
  const authCtx = useContext(AuthContext);

  if (!authCtx.isLoggedIn) {
    return <Navigate to="/auth" />;
  }

  return children;
};

export default ProtectedRoute;