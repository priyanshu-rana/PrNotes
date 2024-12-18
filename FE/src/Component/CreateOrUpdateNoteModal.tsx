import { Button, Image, Input, Modal } from "antd";
import { Formik } from "formik";
import { FC, memo, useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { RiDeleteBinLine } from "react-icons/ri";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";

export type NoteType = {
  title: string;
  description: string;
  attachmentUrl?: File | null | string | any; //TODO replace any after MVP
  done?: boolean;
  tagIds?: string[];
};

type CreateOrUpdateNoteModalProps = {
  open: boolean;
  onCancel: () => void;
  noteDataForUpdate: {
    _id: string;
    title?: string;
    description?: string;
    attachmentUrl?: string;
    tagIds?: string[];
  };
  handleCreateNote: (data: NoteType) => void;
  handleUpdateNote: (data: NoteType) => void;
  handleCreateTag: (data: { title: string }) => void;
  handleDeleteTag: (tagId: string) => void;
  tagList?: { _id: string; title: string }[];
};

const CreateOrUpdateNoteModal: FC<CreateOrUpdateNoteModalProps> = ({
  open,
  onCancel,
  handleCreateNote,
  handleUpdateNote,
  noteDataForUpdate,
  tagList,
  handleCreateTag,
  handleDeleteTag,
}) => {
  const { VITE_REACT_APP_BACKEND_URL } = import.meta.env;
  const [attachment, setAttachment] = useState<any>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagName, setTagName] = useState("");
  const [isDeleteTag, setIsDeleteTag] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ url: any; type: any }>({
    url: "",
    type: "",
  });
  const trimmedTagName = tagName.trim();

  const handleTagClick = (tag: { _id: string; title: string }) => {
    if (!isDeleteTag) {
      setSelectedTagIds(
        selectedTagIds.includes(tag._id)
          ? selectedTagIds.filter((t) => t !== tag._id) //Check whether tag already present in the list, if yes then removes that tag
          : [...selectedTagIds, tag._id]
      );
    } else {
      handleDeleteTag(tag._id);
    }
  };

  useEffect(() => {
    if (noteDataForUpdate.tagIds) {
      setSelectedTagIds(noteDataForUpdate.tagIds);
    }
  }, [noteDataForUpdate.tagIds]);

  return (
    <Modal
      open={open}
      closable
      footer={false}
      onCancel={() => {
        setIsDeleteTag(false);
        onCancel();
      }}
      afterClose={() => setPreviewFile({ url: "", type: "" })}
      title={!noteDataForUpdate._id ? "Add note" : "Update note"}
      destroyOnClose
    >
      <Formik
        onSubmit={async (values) => {
          const noteData: NoteType = {
            title: values.title,
            description: values.description,
            // attachmentUrl: values.attachmentUrl,
            tagIds: selectedTagIds,
          };

          if (values.attachment) {
            const attachment = values.attachment;
            const fileName = attachment.name;
            const contentType = attachment.type;

            try {
              const response = await axios.post(
                `${VITE_REACT_APP_BACKEND_URL}/file/signed-url`,
                {
                  fileName,
                  contentType,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("login"),
                  },
                }
              );
              const { url, path } = response.data;

              await axios.put(url, attachment, {
                headers: {
                  "Content-Type": contentType,
                },
              });

              const attachmentRef = ref(storage, path);
              const attachmentUrl = await getDownloadURL(attachmentRef);

              noteData.attachmentUrl = attachmentUrl;

              !noteDataForUpdate._id
                ? handleCreateNote(noteData)
                : handleUpdateNote(noteData);
            } catch (error) {
              console.error(error);
            }
          } else {
            // If no file/attachment selected
            !noteDataForUpdate._id
              ? handleCreateNote(noteData)
              : handleUpdateNote(noteData);
          }
        }}
        initialValues={
          !noteDataForUpdate
            ? {
                _id: "",
                title: "",
                description: "",
                attachmentUrl: "",
                tagIds: [],
                attachment,
              }
            : {
                title: noteDataForUpdate.title || "",
                description: noteDataForUpdate.description || "",
                attachmentUrl: noteDataForUpdate.attachmentUrl || "",
                tagIds: noteDataForUpdate.tagIds || [],
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
              <TextArea
                name="description"
                placeholder="Enter Description here"
                value={formProps.values.description}
                onChange={formProps.handleChange}
              />
            </div>

            <div>
              <label htmlFor="Attachment">Attachment</label>
              <Input
                type="file"
                onChange={(e: any) => {
                  if (e.target.files && e.target.files[0]) {
                    const selectedFile = e.target.files[0];
                    const selectedFileType = selectedFile.type.split("/")[0];
                    const previewUrl = URL.createObjectURL(selectedFile);
                    formProps.setFieldValue("attachment", selectedFile);
                    setPreviewFile({ url: previewUrl, type: selectedFileType });
                  }
                }}
                // TODO: The file the name shouldn't be there after removing/deattaching file
                suffix={
                  previewFile.url ? (
                    <Button
                      className="hover:text-red-500 text-white bg-red-600"
                      onClick={() => {
                        formProps.setFieldValue("attachment", undefined);
                        setPreviewFile({ url: "", type: "" });
                      }}
                    >
                      X
                    </Button>
                  ) : (
                    <></>
                  )
                }
              />
              <div className="flex ">
                <Input
                  name="image"
                  className="hidden"
                  value={formProps.values.attachmentUrl}
                />

                {previewFile.type == "image" && (
                  <div>
                    <Image src={previewFile.url} alt="Preview" />
                  </div>
                )}
                {previewFile.type == "video" && (
                  <div>
                    <video controls style={{ maxWidth: "400px" }}>
                      <source src={previewFile.url} />
                      Your browser does not support the video element.
                    </video>
                  </div>
                )}
                <img className="w-3/4" src={formProps.values.attachmentUrl} />
              </div>
            </div>
            <div>
              <label htmlFor="Description">Tags</label>
              <Input
                value={tagName}
                placeholder="Create Tag here by typing and clicking or pressing enter"
                onChange={(tag) => setTagName(tag.target.value)}
                className={
                  tagName.trim() !== "" ? `cursor-pointer` : "cursor-auto"
                }
                onClick={() => {
                  trimmedTagName !== "" &&
                    handleCreateTag({ title: trimmedTagName });
                  setTagName("");
                }}
                onKeyPress={(tag) => {
                  if (trimmedTagName !== "" && tag.key === "Enter") {
                    tag.preventDefault();
                    handleCreateTag({ title: trimmedTagName });
                    setTagName("");
                    return;
                  }
                }}
              />
            </div>

            <div className="space-x-2 space-y-1">
              {tagList?.map((tag) => (
                <button
                  className={`${
                    selectedTagIds.includes(tag._id)
                      ? "bg-blue-600"
                      : "bg-gray-400"
                  } text-white rounded-full py-1 px-2 ${
                    isDeleteTag &&
                    "bg-red-400 hover:bg-red-500 hover:animate-bounce"
                  }`}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag.title}
                </button>
              ))}
              {tagList?.length && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className={`flex items-center space-x-2 rounded-full px-2 py-1 text-white text-xs font-bold ${
                      !isDeleteTag ? "bg-red-500" : "bg-blue-500"
                    }`}
                    onClick={() => setIsDeleteTag(!isDeleteTag)}
                  >
                    <RiDeleteBinLine size={16} />
                    <h1>{!isDeleteTag ? "Delete Tag" : "Cancel"}</h1>
                  </button>
                </div>
              )}
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
  );
};

CreateOrUpdateNoteModal.defaultProps = {};

export default memo(CreateOrUpdateNoteModal);

// TODO:
// <Button
//   onClick={() => formProps.setFieldValue("file", null)}  // Remove file from Formik state
// >
//   Remove File
// </Button>
