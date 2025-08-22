// SignupPage.jsx
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { CardContent } from "../components/CardContent";
import { Card } from "../components/Card";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../app/slices/auth/authThunks";
import { clearErrors } from "../app/slices/auth/authSlice";
import GoogleAuth from "../components/Google";
import CircularLoader from "../components/CircularLoader";

const SignupPage = () => {
  const dispatch = useDispatch();
  const { user, status, error, fieldErrors } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md md:max-w-lg shadow-lg p-4 sm:p-6">
        <CardContent>
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
            Sign Up
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="First Name"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                {fieldErrors.firstname && (
                  <p className="text-red-500 text-sm">
                    {fieldErrors.firstname}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                {fieldErrors.lastname && (
                  <p className="text-red-500 text-sm">{fieldErrors.lastname}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-sm">{fieldErrors.email}</p>
                )}
              </div>
              {/* <div className="w-full">
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  name="phoneNo"
                  value={formData.phoneNo}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                {fieldErrors.phoneNo && (
                  <p className="text-red-500 text-sm">{fieldErrors.phoneNo}</p>
                )}
              </div> */}
              <div className="w-full">
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full"
                  required
                />
                {fieldErrors.password && (
                  <p className="text-red-500 text-sm">{fieldErrors.password}</p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full py-2 mt-2 cursor-pointer">
              {status === "loading" ? (
                <CircularLoader color="#fff" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
          <div className="text-center mt-4">
            <GoogleAuth />
          </div>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-gray-500 hover:underline">
                Login
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;
