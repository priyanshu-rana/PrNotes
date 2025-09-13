import { FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createNote,
  createTag,
  decryptNote,
  deleteNote,
  deleteTag,
  encryptNote,
  getNotes,
  getTagList,
  updateNote,
} from "../Service/ApiService";
import { Button, Collapse, Image, Modal } from "antd";
import Header from "../Component/Header";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDoneAll, MdFileCopy, MdLock, MdRemoveDone } from "react-icons/md";
import CreateOrUpdateNoteModal, {
  NoteType,
} from "../Component/CreateOrUpdateNoteModal";
import NoteProtectionModal from "../Component/NoteProtectionModal";

type HomePageProps = {};

const HomePage: FC<HomePageProps> = (props) => {
  const [notes, setNotes] = useState<
    {
      _id: string;
      title: string;
      description: string;
      done: boolean;
      attachmentUrl: string;
      tagIds: [];
      isProtected?: boolean;
    }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [openNoteProtectionModal, setOpenNoteProtectionModal] =
    useState<boolean>(false);
  const [pdfModalOpen, setPdfModalOpen] = useState<boolean>(false);
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>("");
  const [audioModalOpen, setAudioModalOpen] = useState<boolean>(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string>("");

  const [noteDataForUpdate, setNoteDataForUpdate] = useState<{
    _id: string;
    title?: string;
    description?: string;
    attachmentUrl?: string;
    tagIds?: [];
    isProtected?: boolean;
  }>({ _id: "", title: "", description: "" });
  const [isLoaded, setIsLoaded] = useState(false);
  const [tagList, setTagList] = useState<{ _id: string; title: string }[]>();
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [activeTags, setActiveTags] = useState<
    {
      _id: string;
      title: string;
    }[]
  >();

  const filteredNotes = notes.filter((note) => {
    if (selectedTag.length == 0) return true;
    return note.tagIds.some((tagId) => selectedTag.includes(tagId));
  });

  const handleCreateNote = (data: NoteType) => {
    createNote(data, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note created successfully!");
        setIsModalVisible(false);
      })
      .catch((e) => toast.error(e));
  };

  const handleUpdateNote = (data: NoteType) => {
    updateNote(noteDataForUpdate._id, data, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        toast.success("Note updated successfully!");
        setIsModalVisible(false);
        setNoteDataForUpdate({ _id: "", title: "", description: "" });
      })
      .catch((e) => toast.error(e));
  };

  const handleMarkNote = async (noteId: string, done: boolean) => {
    await updateNote(noteId, { done: done }, localStorage.getItem("login"))
      .then(() => {
        setIsLoaded(false);
        setNoteDataForUpdate({ _id: "", description: "", title: "" });
      })
      .catch((e) => toast.error(e));
  };

  const handleEncryptNote = async (noteId: string, secretKey: string) => {
    await encryptNote(
      noteId,
      { secret_key: secretKey },
      localStorage.getItem("login")
    )
      .then(() => {
        setIsLoaded(false);
        setOpenNoteProtectionModal(false);
        toast.success("Note is protected successfully!");
      })
      .catch((e) => toast.error(e.message));
  };

  const handleDecryptNote = async (noteId: string, secretKey: string) => {
    await decryptNote(
      noteId,
      { secret_key: secretKey },
      localStorage.getItem("login")
    )
      .then(() => {
        setIsLoaded(false);
        setOpenNoteProtectionModal(false);
        toast.success("Note is decrypted successfully!");
      })
      .catch((e) => toast.error(e.message));
  };

  const handleProtectNote = async (
    noteId: string,
    isProtected: boolean,
    secret_key: string
  ) => {
    if (noteId)
      isProtected
        ? handleDecryptNote(noteId, secret_key)
        : handleEncryptNote(noteId, secret_key);
  };

  const handleCreateTag = (data: { title: string }) => {
    createTag(data, localStorage.getItem("login")).then(() =>
      setIsLoaded(false)
    );
  };

  const handleDeleteTag = (tagId: string) => {
    deleteTag(tagId, localStorage.getItem("login")).then(() => {
      toast.error("Tag deleted successfully!");
      setIsLoaded(false);
    });
  };

  const handleTagClick = (tagId: string) => {
    if (selectedTag.includes(tagId)) {
      setSelectedTag(selectedTag.filter((t) => t !== tagId));
    } else {
      setSelectedTag([...selectedTag, tagId]);
    }
  };

  useEffect(() => {
    const login = localStorage.getItem("login");
    if (!isLoaded) {
      getNotes(login)
        .then((notes) => {
          setNotes(notes);
          setIsLoaded(true);
        })
        .catch((error) => {
          console.log(error);
          setNotes(undefined as any); // for handling error due to api fail
          setIsLoaded(true);
        });

      getTagList(login)
        .then((tag) => setTagList(tag))
        .then(() => setIsLoaded(true))
        .catch((e) => {
          toast.error(e);
          setIsLoaded(true);
        });
    }
  }, [isLoaded]);

  useEffect(() => {
    const allActiveTagIds: string[] = notes.reduce((acc, note) => {
      note.tagIds.forEach((tagId) => {
        if (!acc.includes(tagId)) {
          acc.push(tagId);
        }
      });
      return acc;
    }, []);

    const activeTagsFromIds = tagList?.filter((tag) => {
      return allActiveTagIds.includes(tag._id);
    });

    setActiveTags(activeTagsFromIds);
  }, [notes]);

  return (
    // <div className="min-h-screen p-10 bg-gradient-to-br from-red-500 via-lime-400 to-blue-500">
    <div className="min-h-screen p-4 md:p-10  bg-gradient-to-r from-gray-800 to-blue-900 ">
      <Header />
      <div className="py-10 space-y-8">
        <button
          disabled={notes === undefined}
          className="py-2 px-10 rounded-lg bg-white text-gray-800 font-semibold hover:scale-110 hover:ease-in-out disabled:scale-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={() => setIsModalVisible(true)}
        >
          + Add Note
        </button>
        <div className="flex flex-wrap space-x-2">
          {activeTags?.map((tag) => (
            <button
              className={`bg-white rounded-full px-2 py-1 mt-2 ${
                selectedTag.includes(tag._id) &&
                "bg-green-400 font-semibold text-blue-700"
              }`}
              onClick={() => handleTagClick(tag._id)}
            >
              {tag.title}
            </button>
          ))}
        </div>
      </div>
      {isLoaded ? (
        // <div className="flex flex-col shrink-0 grow space-y-2 md:w-1/2">
        <div className="space-y-2 lg:w-1/2">
          {notes ? (
            notes.length === 0 && (
              <h1 className="text-white  text-xl">
                Hey !! Create notes by clicking on
                <span className="font-bold"> `+Add Note`</span> button ..
              </h1>
            )
          ) : (
            <h1 className="text-white  text-xl">
              Unable to get Notes,
              <span className="font-bold"> `Try again`</span> or{" "}
              <a
                className="font-bold text-blue-200 text-2xl cursor-pointer"
                href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
              >
                `Contact Us`
              </a>
            </h1>
          )}
          {filteredNotes.map((n, i) => (
            <div key={n._id} className="bg-white bg-opacity-20 rounded-2xl">
              <div
                className={`text-white p-4 space-x-1 flex items-center justify-between
              }`}
              >
                {n.isProtected ? (
                  <div className="flex items-center w-full md:w-4/5">
                    <div className="flex items-center bg-blue-900 bg-opacity-40 rounded-lg px-3 py-2 w-full">
                      <div className="flex items-center space-x-3 w-full">
                        <MdFileCopy
                          className="border-2 border-dashed rounded-xl p-1"
                          size={45}
                        />

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <MdLock
                              className="text-yellow-400 flex-shrink-0"
                              size={20}
                            />
                            <div className="font-bold text-gray-200">
                              Protected Note
                            </div>
                            <span className="text-xs bg-blue-500 bg-opacity-60 px-2 py-1 rounded-full">
                              Locked
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 mt-1">
                            Authenticate to view this content
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${
                      n.done ? "line-through text-green-300" : ""
                    } md:w-4/5`}
                  >
                    <div className="flex font-bold">
                      <h1>{i + 1}.</h1>
                      <h1>{n.title}</h1>
                    </div>
                    <h1 className="break-all">{n.description}</h1>
                  </div>
                )}
                <div className="flex">
                  <div className="mr-4">
                    <button
                      className={`${
                        n.isProtected ? "text-green-400" : "text-red-400"
                      }`}
                      onClick={() => {
                        console.log("n.isProtected", n.isProtected);
                        console.log("noteDataForUpdate", noteDataForUpdate);
                        setNoteDataForUpdate({
                          _id: n._id,
                          isProtected: n.isProtected,
                        });
                        console.log("noteDataForUpdate 2", noteDataForUpdate);

                        console.log("n.isProtected 2", n.isProtected);

                        setOpenNoteProtectionModal(true);
                      }}
                    >
                      <MdLock size={25} />
                    </button>
                  </div>
                  {!n.isProtected && (
                    <div className="flex space-x-4">
                      <button
                        className={n.done ? "text-green-400" : "text-red-400"}
                        onClick={() => {
                          setNoteDataForUpdate({ _id: n._id });
                          handleMarkNote(n._id, !n.done)
                            .then(() =>
                              !n.done
                                ? toast.success(
                                    `Great, you have done: ${n.title}`
                                  )
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
                        className="text-blue-200"
                        onClick={() => {
                          setNoteDataForUpdate(n);
                          setIsModalVisible(true);
                        }}
                      >
                        <FaEdit size={25} />
                      </button>
                      <button
                        className="text-red-500"
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
                  )}
                </div>
              </div>
              {n.attachmentUrl && (
                <Collapse
                  className="font-extrabold border-none bg-cyan-50"
                  items={[
                    {
                      label: "Attachment",
                      children: (
                        <div className="w-40">
                          {n.attachmentUrl.includes("pdf") ? (
                            <button
                              onClick={() => {
                                setCurrentPdfUrl(n.attachmentUrl);
                                setPdfModalOpen(true);
                              }}
                              className="w-full py-2 px-1 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white font-semibold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <span className="flex items-center justify-center gap-2">
                                <MdFileCopy
                                  className="text-blue-300"
                                  size={20}
                                />
                                View PDF
                              </span>
                            </button>
                          ) : n.attachmentUrl.includes("mp3") ||
                            n.attachmentUrl.includes("wav") ||
                            n.attachmentUrl.includes("ogg") ||
                            n.attachmentUrl.includes("aac") ||
                            n.attachmentUrl.includes("m4a") ? (
                            <audio controls>
                              <source src={n.attachmentUrl} />
                              Your browser does not support the audio element.
                            </audio>
                          ) : n.attachmentUrl.includes("jpg") ||
                            n.attachmentUrl.includes("jpeg") ||
                            n.attachmentUrl.includes("png") ||
                            n.attachmentUrl.includes("gif") ||
                            n.attachmentUrl.includes("bmp") ||
                            n.attachmentUrl.includes("webp") ||
                            n.attachmentUrl.includes("svg") ? (
                            <Image src={n.attachmentUrl} />
                          ) : (
                            <button
                              onClick={() =>
                                window.open(n.attachmentUrl, "_blank")
                              }
                              className="w-full py-2 px-1 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white font-semibold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                              <span className="flex items-center justify-center gap-2">
                                <MdFileCopy
                                  className="text-blue-300"
                                  size={20}
                                />
                                Open Attachment
                              </span>
                            </button>
                          )}
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
      <CreateOrUpdateNoteModal
        open={isModalVisible}
        handleCreateNote={handleCreateNote}
        handleUpdateNote={handleUpdateNote}
        handleCreateTag={handleCreateTag}
        handleDeleteTag={handleDeleteTag}
        noteDataForUpdate={noteDataForUpdate}
        onCancel={() => {
          setIsModalVisible(false);
          setNoteDataForUpdate({
            _id: "",
            title: "",
            description: "",
            attachmentUrl: "",
            tagIds: [],
          });
        }}
        tagList={tagList}
      />
      <NoteProtectionModal
        title={noteDataForUpdate.isProtected ? "Unlock Note" : "Protect Note"}
        isModalOpen={openNoteProtectionModal}
        onCancel={() => {
          setOpenNoteProtectionModal(false);
        }}
        note={noteDataForUpdate}
        handleProtectNote={handleProtectNote}
      />

      {/* PDF Modal */}
      <Modal
        title="PDF Viewer"
        open={pdfModalOpen}
        onCancel={() => setPdfModalOpen(false)}
        footer={
          <div className="flex justify-end">
            <button
              className="py-1 px-4 rounded-lg bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 text-white font-semibold shadow hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => window.open(currentPdfUrl, "_blank")}
            >
              Full Screen
            </button>
          </div>
        }
        width="90vw"
        style={{ top: 20 }}
        bodyStyle={{
          height: "80vh",
          overflow: "auto",
          padding: 0,
        }}
      >
        <iframe
          src={currentPdfUrl}
          width="100%"
          height="100%"
          style={{ border: "none", minHeight: "80vh" }}
          title="PDF Viewer"
        />
      </Modal>
    </div>
  );
};

export default HomePage;
