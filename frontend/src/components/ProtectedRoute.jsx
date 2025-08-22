import { useSelector } from "react-redux";
import { Navigate } from "react-router";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;
