import { FC, memo, useEffect, useState } from "react";
import Signup from "./Signup";
import { Formik } from "formik";
import { signIn } from "../Service/ApiService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "antd";
import PasswordInput from "./PasswordInput";

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
      <div className="bg-white min-w-360 p-8 rounded shadow-lg">
        <h1 className="text-3xl text-gray-800 mb-6">Login</h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async (values) => {
            setIsLoading(true);
            try {
              await signIn(values);
              toast.success("Login Successful !!");
              navigate("/");
            } catch (error: any) {
              console.error("Error SignIn:", error);
              toast.error(error || "An error occurred, please try again.");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {(formProps) => (
            <form className="flex flex-col" onSubmit={formProps.handleSubmit}>
              <input
                name="email"
                value={formProps.values.email}
                onChange={formProps.handleChange}
                type="text"
                placeholder="Email"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <PasswordInput
                value={formProps.values.password}
                onChange={formProps.handleChange}
              />
              <Button
                htmlType="submit"
                type="primary"
                loading={isLoading}
                className="bg-purple-600 text-white rounded px-4"
              >
                Login
              </Button>
            </form>
          )}
        </Formik>
        <div className="mt-4 flex">
          <span>Don't have an account ?</span>
          <button
            className="text-purple-600 ml-1"
            onClick={() => setIsSignupForm(true)}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Signup onClick={() => setIsSignupForm(false)} />
  );
};

LoginSignup.defaultProps = {};
export default memo(LoginSignup);
