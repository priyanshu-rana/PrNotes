import { Formik } from "formik";
import { FC, memo } from "react";
import { signUp } from "../Service/ApiService";

type SignupProps = {
  onClick: () => void;
};

const Signup: FC<SignupProps> = (props) => {
  const signupInitialValues = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500">
      <div className="bg-white p-8 rounded shadow-lg">
        <h1 className="text-3xl text-gray-800 mb-6">Signup</h1>
        <Formik
          onSubmit={(values) => signUp(values)}
          initialValues={signupInitialValues}
        >
          {(formProps) => (
            <form className="flex flex-col" onSubmit={formProps.handleSubmit}>
              <input
                name="first_name"
                value={formProps.values.first_name}
                onChange={formProps.handleChange}
                type="text"
                placeholder="First Name"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <input
                name="last_name"
                value={formProps.values.last_name}
                onChange={formProps.handleChange}
                type="text"
                placeholder="Last Name"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <input
                name="email"
                value={formProps.values.email}
                onChange={formProps.handleChange}
                type="text"
                placeholder="Email"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <input
                name="password"
                value={formProps.values.password}
                onChange={formProps.handleChange}
                type="password"
                placeholder="Password"
                className="bg-gray-200 rounded py-2 px-4 mb-4 text-gray-800"
              />
              <button
                type="submit"
                // onClick={() => formProps.handleSubmit()}
                className="bg-purple-600 text-white rounded py-2 px-4 hover:bg-purple-700"
              >
                SignUp
              </button>
            </form>
          )}
        </Formik>
        <div className="mt-4 flex cursor-pointer" onClick={props.onClick}>
          Have an account ?{" "}
          <span className="text-purple-600 ml-1"> Sign In</span>
        </div>
      </div>
    </div>
  );
};

Signup.defaultProps = {};

export default memo(Signup);
