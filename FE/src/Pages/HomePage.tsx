import { FC, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createNote, deleteNote, getNotes } from "../Service/ApiService";
import { Input, Modal } from "antd";
import { Formik } from "formik";
import Header from "../Component/Header";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = (props) => {
  const [notes, setNotes] = useState<
    { _id: string; title: string; description: string }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCreateNote = (values: {
    _id: string;
    title: string;
    description: string;
  }) => {
    createNote(values, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note created successfully!");
      })
      .catch((e) => toast.error(e));
  };
  useEffect(() => {
    const login = localStorage.getItem("login");
    if (!isLoaded) {
      getNotes(login).then((notes) => {
        setNotes(notes);
        // toast.success("Notes fetched sucessfully!");
        setIsLoaded(true);
      });
    }
  }, [isLoaded]);

  return (
    <div className="h-screen p-10  bg-gradient-to-br from-purple-700 via-pink-600 to-red-500">
      <Header />
      <div className="py-10 flex space-x-4">
        <button
          className="py-2 px-10 rounded-lg bg-white text-gray-800 font-semibold hover:scale-110 hover:ease-in-out"
          onClick={() => setIsModalVisible(true)}
        >
          + Add Note
        </button>
      </div>
      {!!notes.length && (
        <div className="flex flex-col shrink-0 grow space-y-2 md:w-1/2">
          {notes.map((n, i) => (
            <div
              className={`bg-white p-4 space-x-1 rounded-2xl flex items-center justify-between
              }`}
              key={n._id}
            >
              <div>
                <div className="flex">
                  <h1>{i + 1}.</h1>
                  <h1>{n.title}</h1>
                </div>
                <h1>{n.description}</h1>
              </div>
              <button
                className="text-red-600 font-extrabold"
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
                X
              </button>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
      <Modal
        open={isModalVisible}
        closable
        footer={false}
        onCancel={() => setIsModalVisible(false)}
      >
        <Formik
          onSubmit={handleCreateNote}
          initialValues={{ _id: "", title: "", description: "" }}
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
                + Add
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
