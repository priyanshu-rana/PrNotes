import { Button, Input, Modal } from "antd";
import { FC, memo, useState } from "react";

type NoteProtectionModalProps = {
  isModalOpen: boolean;
  onCancel: () => void;
  title: string;
  note: { _id: string; isProtected?: boolean };
  handleProtectNote: (
    noteId: string,
    isProtected: boolean,
    secret_key: string
  ) => Promise<void>;
};

const NoteProtectionModal: FC<NoteProtectionModalProps> = ({
  isModalOpen,
  onCancel,
  title,
  note,
  handleProtectNote,
}) => {
  const [value, setValue] = useState<string>("");
  return (
    <Modal
      open={isModalOpen}
      destroyOnClose={true}
      closable={true}
      onCancel={() => {
        setValue("");
        onCancel();
      }}
      onOk={() => {
        setValue("");
      }}
      footer={false}
      title={title}
      width={400}
    >
      <div className="py-4 space-x-2 flex items-center">
        <Input
          className=""
          value={value}
          placeholder="Enter your Secret Key Here!"
          onChange={(v) => setValue(v.target.value)}
        />

        <Button
          onClick={() =>
            handleProtectNote(note._id, note.isProtected!, value).finally(() =>
              setValue("")
            )
          }
        >
          Enter
        </Button>
      </div>
    </Modal>
  );
};

NoteProtectionModal.defaultProps = {};

export default memo(NoteProtectionModal);
