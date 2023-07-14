import axios from "axios";

export const signUp = async (data: {
  first_name: string;
  email: string;
  password: string;
  last_name?: string;
}) => {
  await axios
    .post("http://localhost:5000/user/signup", { ...data })
    .then((res) => {
      console.log(res);
      // alert("User Created Sucessfully !!");
    })
    .catch((e) => alert(e.response.data.message));
};

export const signIn = async (data: { email: string; password: string }) => {
  await axios
    .post("http://localhost:5000/user/signin", { ...data })
    .then((res) => {
      console.log(res);
      // alert("User Login Successful");
    })
    .catch((e) => alert(e));
};
