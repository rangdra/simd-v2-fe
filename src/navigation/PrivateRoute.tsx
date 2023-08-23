import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useGlobalContext } from "../context/GlobalContext";
import { ERoleType } from "../types";

const PrivateRoute = ({ children, role }: { children: JSX.Element; role?: ERoleType }) => {
  const { currentUser } = useGlobalContext();
  const token = Cookies.get("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
