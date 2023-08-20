import { FC, memo, useEffect, useState } from "react";
import Signup from "./Signup";
import { Formik } from "formik";
import { signIn } from "../Service/ApiService";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "antd";

type LoginSignupProps = {};

const LoginSignup: FC<LoginSignupProps> = (props) => {
  const [isSignupForm, setIsSignupForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (login) {
      navigate("/");
    }
  }, []);

  return !isSignupForm ? (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-800 to-blue-900">
      {/*Can also use: via-green-800 */}
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl text-gray-800 mb-6">Login</h1>
        <ToastContainer />
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            setIsLoading(true);
            signIn(values)
              .then(() => {
                navigate("/");
              })
              .catch((e) => {
                console.log(e);
                toast.error(e);
              })
              .finally(() => setIsLoading(false));
          }}
        >
          {(formprops) => (
            <form className="flex flex-col" onSubmit={formprops.handleSubmit}>
              <input
                name="email"
                value={formprops.values.email}
                onChange={formprops.handleChange}
                type="text"
                placeholder="Email"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <input
                name="password"
                value={formprops.values.password}
                onChange={formprops.handleChange}
                type="password"
                placeholder="Password"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <Button
                htmlType="submit"
                type="primary"
                loading={isLoading}
                className="bg-purple-600 text-white rounded  px-4 hover:bg-purple-700"
              >
                Login
              </Button>
            </form>
          )}
        </Formik>
        <div
          className=" mt-4 flex cursor-pointer"
          onClick={() => setIsSignupForm(true)}
        >
          Don't have an account ?
          <span className="text-purple-600 ml-1">Sign up</span>
        </div>
      </div>
    </div>
  ) : (
    <Signup onClick={() => setIsSignupForm(false)} />
  );
};

LoginSignup.defaultProps = {};
export default memo(LoginSignup);
