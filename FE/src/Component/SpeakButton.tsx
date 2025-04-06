import { Button, Modal } from "antd";
import nlp from "compromise";
import { FC, memo, useState, useRef, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { createModel } from "vosk-browser";
import { voskService } from "../Service/VoskService";
import { nlpService } from "../Service/NlpService";
import { RiCrosshair2Fill } from "react-icons/ri";

type NoteData = {
  title: string;
  description: string;
  tags?: string[];
};

type SpeakButtonProps = {
  onNoteReady: (data: NoteData) => void;
};

const SpeakButton: FC<SpeakButtonProps> = ({ onNoteReady }) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const streamRef = useRef<MediaStream>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { sampleRate: 16000, channelCount: 1 },
      });
      streamRef.current = stream;

      await voskService.start(stream, (text) => {
        setTranscript((prev) => `${prev} ${text}`.trim());
      });

      setIsListening(true);
      setTranscript("");
    } catch (error) {
      console.error("Mic error", error);
    }
  };

  const stopRecording = () => {
    if (!isListening || !streamRef.current) return;

    voskService.stop(streamRef.current);

    setIsListening(false);
    const finalText = transcript.trim();
    if (finalText) onNoteReady(nlpService.processText(finalText));
  };

  const resetRecording = async () => {
    if (!isListening || !streamRef.current) return;
    voskService.stop(streamRef.current);

    await startRecording();
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={startRecording}
        disabled={isListening}
        className="border-2 rounded-full p-2 text-white hover:bg-white hover:text-red-400"
      >
        <FaMicrophone size={24} />
      </button>

      <Modal
        open={isListening}
        footer={null}
        closable={true}
        onCancel={() => {
          voskService.stop(streamRef.current!);
          setIsListening(false);
        }}
        width={600}
      >
        <div className="flex flex-col gap-4">
          <div className="flex  space-x-4">
            <Button
              classNames={{
                icon: "text-blue-500",
              }}
              onClick={resetRecording}
              icon={<FaStop />}
              size="large"
              className="flex items-center text-blue-500 border-blue-500"
            >
              Reset
            </Button>
            <Button
              danger
              onClick={stopRecording}
              icon={<FaStop />}
              size="large"
              className="flex items-center"
            >
              Stop & Save
            </Button>
          </div>
          <div className="p-4 border rounded-lg bg-gray-50 max-h-60 overflow-y-auto">
            <p className="font-semibold mb-2">Transcript:</p>
            <div className="whitespace-pre-wrap">
              {transcript || (
                <span className="text-gray-400">Start speaking...</span>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default memo(SpeakButton);
