import { FC, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../Service/ApiService";
import { Button, Input, Modal } from "antd";
import { Formik } from "formik";
import Header from "../Component/Header";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDoneAll, MdRemoveDone } from "react-icons/md";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = (props) => {
  const [notes, setNotes] = useState<
    { _id: string; title: string; description: string; done: boolean }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [noteDataForUpdate, setNoteDataForUpdate] = useState<{
    _id: string;
    title?: string;
    description?: string;
  }>({ _id: "", title: "", description: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCreateNote = (values: {
    // _id: string;
    title: string;
    description: string;
  }) => {
    createNote(values, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note created successfully!");
        setIsModalVisible(false);
      })
      .catch((e) => toast.error(e));
  };

  const handleUpdateNote = (data: {
    title?: string;
    description?: string;
    done?: boolean;
  }) => {
    updateNote(noteDataForUpdate._id, data, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note updated successfully!");
        setIsModalVisible(false);
      })
      .catch((e) => toast.error(e));
  };

  const handleMarkNote = async (noteId: string, done: boolean) => {
    await updateNote(noteId, { done }, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        setNoteDataForUpdate({ _id: "", description: "", title: "" });
      })
      .catch((e) => toast.error(e));
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (!isLoaded) {
      getNotes(login).then((notes) => {
        setNotes(notes);
        setIsLoaded(true);
      });
    }
  }, [isLoaded]);

  return (
    // <div className="min-h-screen p-10 bg-gradient-to-br from-red-500 via-lime-400 to-blue-500">
    <div className="min-h-screen p-10  bg-gradient-to-r from-gray-800 to-blue-900 ">
      <Header />
      <div className="py-10 flex space-x-4">
        <button
          className="py-2 px-10 rounded-lg bg-white text-gray-800 font-semibold hover:scale-110 hover:ease-in-out"
          onClick={() => setIsModalVisible(true)}
        >
          + Add Note
        </button>
      </div>
      {!!notes.length && isLoaded ? (
        <div className="flex flex-col shrink-0 grow space-y-2 md:w-1/2">
          {notes.map((n, i) => (
            <div
              className={`bg-white bg-opacity-20 text-white p-4 space-x-1 rounded-2xl flex items-center justify-between
              }`}
              key={n._id}
            >
              <div className={n.done ? "line-through text-green-300" : ""}>
                <div className="flex font-bold">
                  <h1>{i + 1}.</h1>
                  <h1>{n.title}</h1>
                </div>
                <h1>{n.description}</h1>
              </div>
              <div className="flex space-x-4">
                <button
                  className={n.done ? "text-green-400" : "text-red-400"}
                  onClick={() => {
                    setNoteDataForUpdate({ _id: n._id });
                    handleMarkNote(n._id, !n.done ? true : false)
                      .then(() =>
                        !n.done
                          ? toast.success(`Great, you have done: ${n.title}`)
                          : toast.success(
                              `Opps, removed ' ${n.title} ' from done`
                            )
                      )
                      .catch((e) => console.log(e));
                  }}
                >
                  {n.done ? (
                    <MdRemoveDone size={25} />
                  ) : (
                    <MdDoneAll size={25} />
                  )}
                </button>
                <button
                  className="text-blue-200 font-extrabold"
                  onClick={() => {
                    setNoteDataForUpdate(n);
                    setIsModalVisible(true);
                  }}
                >
                  <FaEdit size={25} />
                </button>
                <button
                  className="text-red-500 font-extrabold"
                  onClick={() => {
                    deleteNote(n._id, localStorage.getItem("login"))
                      .then(() => {
                        setIsLoaded(false);
                        toast.success("Note is deleted sucessfully!!");
                      })
                      .catch((e) => console.log(e));

                    // setNotes([...notes].filter((note) => note._id !== n._id));
                  }}
                >
                  <RiDeleteBinLine size={25} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Button
          loading={true}
          className="border-none text-white text-5xl"
          size={80 as any}
        >
          Loading
        </Button>
      )}
      <ToastContainer />
      <Modal
        open={isModalVisible}
        closable
        footer={false}
        onCancel={() => {
          setIsModalVisible(false);
          setNoteDataForUpdate({ _id: "", title: "", description: "" });
        }}
        title={!noteDataForUpdate._id ? "Add note" : "Update note"}
        destroyOnClose
      >
        <Formik
          onSubmit={
            !noteDataForUpdate._id ? handleCreateNote : handleUpdateNote
          }
          initialValues={
            !noteDataForUpdate
              ? { _id: "", title: "", description: "" }
              : {
                  title: noteDataForUpdate.title || "",
                  description: noteDataForUpdate.description || "",
                }
          }
        >
          {(formProps) => (
            <form className="py-10 space-y-5" onSubmit={formProps.handleSubmit}>
              <div>
                <label htmlFor="Title">Title</label>
                <Input
                  name="title"
                  placeholder="Enter Title here"
                  value={formProps.values.title}
                  onChange={formProps.handleChange}
                />
              </div>
              <div>
                <label htmlFor="Description">Description</label>
                <Input
                  name="description"
                  placeholder="Enter Description here"
                  value={formProps.values.description}
                  onChange={formProps.handleChange}
                />
              </div>

              <button
                className="text-xl bg-gray-700 text-white border border-white rounded-xl px-4 hover:scale-105"
                type="submit"
              >
                {!noteDataForUpdate._id ? "+ Add" : "Update"}
              </button>
            </form>
          )}
        </Formik>
      </Modal>
    </div>
  );
};

HomePage.defaultProps = {};

export default HomePage;
