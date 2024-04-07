import { Button, Input, Modal } from "antd";
import { Formik } from "formik";
import { FC, memo, useEffect, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { RiDeleteBinLine } from "react-icons/ri";
import TextArea from "antd/es/input/TextArea";

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
}) => {
  const [attachment, setAttachment] = useState<any>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tagName, setTagName] = useState("");
  const trimmedTagName = tagName.trim();

  const attachmentUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files![0];
    setAttachment(files);
    if (attachment == null) return;
    const attachmentRef = ref(storage, `attachments/${attachment.name + v4()}`);
    uploadBytes(attachmentRef, attachment).then((snapshot) =>
      getDownloadURL(snapshot.ref).then((url) => setAttachmentUrl(url))
    );
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
      onCancel={onCancel}
      title={!noteDataForUpdate._id ? "Add note" : "Update note"}
      destroyOnClose
    >
      <Formik
        onSubmit={(values) => {
          const noteData: NoteType = {
            title: values.title,
            description: values.description,
            attachmentUrl: values.attachmentUrl,
            tagIds: selectedTagIds,
          };

          !noteDataForUpdate._id
            ? handleCreateNote(noteData)
            : handleUpdateNote(noteData);
        }}
        initialValues={
          !noteDataForUpdate
            ? {
                _id: "",
                title: "",
                description: "",
                attachmentUrl: "",
                tagIds: [],
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
                  // TODO: Add modal for confirmation of file upload (e.g. wether you wanna upload this attachment??)
                  const attachmentRef = ref(
                    storage,
                    `attachments/${e.target.files[0].name + v4()}`
                  );
                  uploadBytes(attachmentRef, e.target.files[0]).then(
                    (snapshot) =>
                      getDownloadURL(snapshot.ref).then((url) => {
                        // setAttachmentUrl(url);
                        formProps.setFieldValue("attachmentUrl", url);
                      })
                  );
                }}
                suffix={
                  <Button
                    className="hover:text-red-500"
                    // TODO: On this button click remove Uploaded File from Firebase Storage and the AttachmentUrl from Database
                    // onClick={() => formProps.setFieldValue("image", null)}
                  >
                    X
                  </Button>
                }
              />
              <div className="flex ">
                <Input
                  name="image"
                  className="hidden"
                  value={formProps.values.attachmentUrl}
                />
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
                  } text-white rounded-full py-1 px-2`}
                  type="button"
                  onClick={() => {
                    setSelectedTagIds(
                      selectedTagIds.includes(tag._id)
                        ? selectedTagIds.filter((t) => t !== tag._id) //Check whether tag already present in the list, if yes then removes that tag
                        : [...selectedTagIds, tag._id]
                    );
                  }}
                >
                  {tag.title}
                </button>
              ))}
              {tagList?.length && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="flex items-center space-x-2 bg-red-500 rounded-full px-2 py-1 text-white text-xs font-bold"
                  >
                    <RiDeleteBinLine size={16} />
                    <h1>Delete Tag</h1>
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
