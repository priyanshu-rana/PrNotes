import { Button, Input, Modal, Upload } from "antd";
import { Formik } from "formik";
import { FC, InputHTMLAttributes, memo, useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

export type NoteType = {
  title: string;
  description: string;
  attachmentUrl?: File | null | string | any; //TODO replace any after MVP
  done?: boolean;
};

type CreateOrUpdateNoteModalProps = {
  open: boolean;
  onCancel: () => void;
  noteDataForUpdate: {
    _id: string;
    title?: string;
    description?: string;
    attachmentUrl?: string;
  };
  handleCreateNote: (data: NoteType) => void;
  handleUpdateNote: (data: NoteType) => void;
};

const CreateOrUpdateNoteModal: FC<CreateOrUpdateNoteModalProps> = ({
  open,
  onCancel,
  handleCreateNote,
  handleUpdateNote,
  noteDataForUpdate,
}) => {
  const [attachment, setAttachment] = useState<any>(null);
  const [attachmentUrl, setAttachmentUrl] = useState("");

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
        onSubmit={!noteDataForUpdate._id ? handleCreateNote : handleUpdateNote}
        initialValues={
          !noteDataForUpdate
            ? { _id: "", title: "", description: "", attachmentUrl: "" }
            : {
                title: noteDataForUpdate.title || "",
                description: noteDataForUpdate.description || "",
                attachmentUrl: noteDataForUpdate.attachmentUrl || null,
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
