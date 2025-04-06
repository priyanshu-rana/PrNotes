import { createModel } from "vosk-browser";

export class VoskService {
  private recognizer: any;
  // private model: any;
  private audioContext?: AudioContext;
  private processor?: ScriptProcessorNode;
  private source?: MediaStreamAudioSourceNode;

  constructor(private modelPath: string) {}

  // setModelPath(path: string){
  //   this.modelPath = path
  //   this.mo
  // }

  async start(stream: MediaStream, onText: (text: string) => void) {
    try {
      const model = await createModel(this.modelPath);
      this.recognizer = new model.KaldiRecognizer(16000);

      this.audioContext = new AudioContext({ sampleRate: 16000 });
      this.source = this.audioContext.createMediaStreamSource(stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.recognizer.on("result", (message: any) => {
        onText(message.result?.text || "");
      });

      this.processor.onaudioprocess = (e) => {
        try {
          this.recognizer.acceptWaveform(e.inputBuffer);
        } catch (error) {
          console.error("Waveform processing error:", error);
        }
      };

      this.source.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
    } catch (error) {
      console.error("Error initializing VoskService:", error);
    }
  }

  stop(stream: MediaStream) {
    stream.getTracks().forEach((track) => track.stop());
    this.source?.disconnect();
    this.processor?.disconnect();
    this.audioContext?.close();
  }
}

export const voskService = new VoskService(
  // "/models/vosk-model-small-en-in-0.4-fixed.tar.gz" #TODO  Not working yet, work on it later
  "/models/vosk-model-small-en-us-0.15.tar.gz"
  // "/models/vosk-model-small-hi-0.22.tar.gz"
);
