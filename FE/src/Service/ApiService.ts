import axios from "axios";

// const { REACT_APP_BACKEND_URL } = process.env;
// const REACT_APP_BACKEND_URL = "https://notes-app-0hgc.onrender.com";
const REACT_APP_BACKEND_URL = "http://localhost:5000";

export const signUp = async (data: {
  first_name: string;
  email: string;
  password: string;
  last_name?: string;
}) => {
  await axios
    .post(`${REACT_APP_BACKEND_URL}/user/signup`, { ...data })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => alert(e.response.data.message));
};

export const signIn = async (data: { email: string; password: string }) => {
  try {
    await axios
      .post(`${REACT_APP_BACKEND_URL}/user/signin`, { ...data })
      .then((res) => {
        localStorage.setItem("login", res.data.token);
        console.log("sigin sucessful");
      });
  } catch (error) {
    console.log(error);
  }
};

export const createNote = async (data: FormData, auth_token: string | null) => {
  await axios
    .post(`${REACT_APP_BACKEND_URL}/note`, data, {
      headers: {
        Authorization: auth_token,
        // "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res)
    .catch((e) => {
      throw e;
    });
};

export const updateNote = async (
  noteId: string | number,
  data: FormData | boolean,
  auth_token: string | null
) => {
  try {
    await axios.put(`${REACT_APP_BACKEND_URL}/note/${noteId}`, data, {
      headers: {
        Authorization: auth_token,
        // "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const getNotes = async (auth_token?: string | null) => {
  try {
    const response = await axios.get(`${REACT_APP_BACKEND_URL}/note`, {
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
    await axios.delete(`${REACT_APP_BACKEND_URL}/note/${noteId}`, {
      headers: { Authorization: auth_token },
    });
  } catch (error: any) {
    throw new Error("Unable to delete Note!", error);
  }
};
