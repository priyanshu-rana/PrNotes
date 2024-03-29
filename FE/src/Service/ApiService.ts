import axios from "axios";
import { NoteType } from "../Component/CreateOrUpdateNoteModal";

const { VITE_REACT_APP_BACKEND_URL } = import.meta.env;

export const signUp = async (data: {
  first_name: string;
  email: string;
  password: string;
  last_name?: string;
}) => {
  await axios
    .post(`${VITE_REACT_APP_BACKEND_URL}/user/signup`, { ...data })
    .then((res) => {
      console.log(res);
    })
    .catch((e) => {
      throw e;
    });
};

export const signIn = async (data: { email: string; password: string }) => {
  try {
    await axios
      .post(`${VITE_REACT_APP_BACKEND_URL}/user/signin`, { ...data })
      .then((res) => {
        localStorage.setItem("login", res.data.token);
        console.log("sigin sucessful");
      });
  } catch (error) {
    console.log(error);
  }
};

export const createNote = async (data: NoteType, auth_token: string | null) => {
  await axios
    .post(`${VITE_REACT_APP_BACKEND_URL}/note`, data, {
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
  data: NoteType | { done: boolean },
  auth_token: string | null
) => {
  try {
    await axios.put(`${VITE_REACT_APP_BACKEND_URL}/note/${noteId}`, data, {
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
    const response = await axios.get(`${VITE_REACT_APP_BACKEND_URL}/note`, {
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
    await axios.delete(`${VITE_REACT_APP_BACKEND_URL}/note/${noteId}`, {
      headers: { Authorization: auth_token },
    });
  } catch (error: any) {
    throw new Error("Unable to delete Note!", error);
  }
};

export const getTagList = async (auth_token: string | null) => {
  try {
    const response = await axios.get(`${VITE_REACT_APP_BACKEND_URL}/tag/list`, {
      headers: { Authorization: auth_token },
    });
    return response.data;
  } catch (error) {
    throw new Error("Unable to get tag list");
  }
};
