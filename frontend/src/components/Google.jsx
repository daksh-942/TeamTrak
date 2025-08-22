import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./Button";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../app/slices/auth/authSlice";
import CircularLoader from "./CircularLoader";
const GoogleAuth = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleGoogleResponse = async (response) => {
      const token = response.credential;
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/users/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token }),
        }
      );

      const data = await res.json();
      const user = data.user;
      dispatch(setCurrentUser(user));
      setIsLoading(false);
    };
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });
  }, [dispatch]);

  const handleClick = () => {
    google.accounts.id.prompt(); // 👈 shows Google popup
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="w-full cursor-pointer flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 border border-gray-300"
    >
      {isLoading ? (
        <CircularLoader />
      ) : (
        <>
          <FcGoogle className="mr-2 text-lg" />
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
};

export default GoogleAuth;
