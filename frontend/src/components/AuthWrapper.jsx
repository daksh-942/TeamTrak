import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import SplashScreen from "./SplashScreen";
import { fetchCurrentUser } from "../app/slices/auth/authThunks";

const AuthWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) return <SplashScreen />;
  return children;
};

export default AuthWrapper;
