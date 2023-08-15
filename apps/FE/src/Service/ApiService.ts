import axios from "axios";
import { toast } from "react-toastify";

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
  try {
    await axios
      .post("http://localhost:5000/user/signin", { ...data })
      .then((res) => localStorage.setItem("login", res.data.token));
    // return response
    // toast.success("LoggedIn Sucessfully!");
  } catch (error) {
    // toast.error("Unable to Login!");
    console.log(error);
  }
};

export const createNote = async (
  data: {
    title: string;
    description: string;
  },
  auth_token: string | null
) => {
  await axios
    .post(
      "http://localhost:5000/note",
      { ...data },
      { headers: { Authorization: auth_token } }
    )
    .then((res) => res)
    .catch((e) => {
      throw e;
    });
};

export const getNotes = async (auth_token?: string | null) => {
  try {
    const response = await axios.get("http://localhost:5000/note", {
      headers: { Authorization: auth_token },
    });
    return response.data;
  } catch (error: any) {
    throw new Error("Error fetching data from the API!", error);
  }
};

export const deleteNote = async (
  noteId: string | number,
  auth_token: string | null
) => {
  try {
    await axios.delete(`http://localhost:5000/note/${noteId}`, {
      headers: { Authorization: auth_token },
    });
  } catch (error: any) {
    throw new Error("Unable to delete Note!", error);
  }
};
