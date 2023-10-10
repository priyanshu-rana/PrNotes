import { FC, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../Service/ApiService";
import { Button, Collapse, Image } from "antd";
import Header from "../Component/Header";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDoneAll, MdRemoveDone } from "react-icons/md";
import CreateOrUpdateNoteModal, {
  NoteType,
} from "../Component/CreateOrUpdateNoteModal";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = (props) => {
  const [notes, setNotes] = useState<
    {
      _id: string;
      title: string;
      description: string;
      done: boolean;
      image: string;
    }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [noteDataForUpdate, setNoteDataForUpdate] = useState<{
    _id: string;
    title?: string;
    description?: string;
  }>({ _id: "", title: "", description: "" });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleCreateNote = (data: NoteType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    // if (data.image) {
    formData.append("image", data.image);
    // }
    createNote(formData, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note created successfully!");
        setIsModalVisible(false);
      })
      .catch((e) => toast.error(e));
  };

  const handleUpdateNote = (data: NoteType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }

    updateNote(noteDataForUpdate._id, formData, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note updated successfully!");
        setIsModalVisible(false);
        setNoteDataForUpdate({ _id: "", title: "", description: "" });
      })
      .catch((e) => toast.error(e));
  };

  const handleMarkNote = async (noteId: string, done: boolean) => {
    const formData = new FormData();
    formData.append("done", `${done}`);
    await updateNote(noteId, formData, localStorage.getItem("login"))
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
    <div className="min-h-screen p-4 md:p-10  bg-gradient-to-r from-gray-800 to-blue-900 ">
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
        // <div className="flex flex-col shrink-0 grow space-y-2 md:w-1/2">
        <div className="space-y-2 lg:w-1/2">
          {notes.map((n, i) => (
            <div key={n._id} className="bg-white bg-opacity-20 rounded-2xl">
              <div
                className={`text-white p-4 space-x-1 flex items-center justify-between
              }`}
              >
                <div
                  className={`${
                    n.done ? "line-through text-green-300" : ""
                  } md:w-4/5`}
                >
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
              {n.image && (
                <Collapse
                  className="font-extrabold border-none bg-cyan-50"
                  items={[
                    {
                      label: "Attachment",
                      children: (
                        <div className="w-40">
                          <Image src={n.image} />
                        </div>
                      ),
                    },
                  ]}
                />
              )}
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
      <CreateOrUpdateNoteModal
        open={isModalVisible}
        handleCreateNote={handleCreateNote}
        handleUpdateNote={handleUpdateNote}
        noteDataForUpdate={noteDataForUpdate}
        onCancel={() => {
          setIsModalVisible(false);
          setNoteDataForUpdate({ _id: "", title: "", description: "" });
        }}
      />
    </div>
  );
};

HomePage.defaultProps = {};

export default HomePage;
