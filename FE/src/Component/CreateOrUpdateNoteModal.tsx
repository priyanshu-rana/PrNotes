import { Button, Input, Modal, Upload } from "antd";
import { Formik } from "formik";
import { FC, memo } from "react";

export type NoteType = {
  title: string;
  description: string;
  image?: File | null | string;
  done?: boolean;
};

type CreateOrUpdateNoteModalProps = {
  open: boolean;
  onCancel: () => void;
  noteDataForUpdate: {
    _id: string;
    title?: string;
    description?: string;
    image?: any;
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
            ? { _id: "", title: "", description: "", image: null }
            : {
                title: noteDataForUpdate.title || "",
                description: noteDataForUpdate.description || "",
                // image: noteDataForUpdate.image || null,
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
              {/* <Upload>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload> */}
              <label htmlFor="Attachment">Attachment</label>
              <Input
                type="file"
                // value={formProps.values.image}
                onChange={(e) => {
                  const file = e.currentTarget.files
                    ? e.currentTarget.files[0]
                    : null;

                  console.log("e.currentTarget.files", file);
                  formProps.setFieldValue("image", file);
                }}
                suffix={
                  <Button
                    className="hover:text-red-500"
                    onClick={() => formProps.setFieldValue("image", null)}
                  >
                    X
                  </Button>
                }
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
  );
};

CreateOrUpdateNoteModal.defaultProps = {};

export default memo(CreateOrUpdateNoteModal);
