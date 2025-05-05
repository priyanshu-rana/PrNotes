import Vapi from "@vapi-ai/web";
import { FC, memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createNote, updateNote } from "../Service/ApiService";

declare global {
  interface Window {
    vapi?: Vapi;
  }
}

const VapiHandler = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  //   const [transcripts, setTranscripts] = useState<string[]>([]);

  useEffect(() => {
    const vapi = new Vapi(import.meta.env.VITE_VAPI_API_KEY);
    window.vapi = vapi;

    // Define all handler functions
    const handleCallStart = () => {
      setIsCallActive(true);
      toast.info("Voice assistant connected");
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      toast.info("Voice assistant disconnected");
    };

    const handleMessage = async (message: any) => {
      console.log("Vapi Message:", message);

      // Check if this is a function call
      if (message.type === "function-call") {
        const { name, parameters } = message.functionCall;
        console.log(`Function call: ${name}`, parameters);

        try {
          switch (name) {
            case "createNote":
              const result = await createNote(
                parameters,
                localStorage.getItem("login")!
              );
              console.log("Note created:", result);
              toast.success("Note created successfully!");
              break;

            case "updateNote":
              await updateNote(
                parameters.noteId,
                parameters,
                localStorage.getItem("login")!
              );
              toast.success("Note updated successfully!");
              break;

            default:
              console.warn(`Unknown function call: ${name}`);
          }
        } catch (error) {
          console.error(`Error executing function ${name}:`, error);
          toast.error(
            `Failed to ${name.replace("Note", " note")}: ${
              (error as Error).message
            }`
          );
        }
      }
    };

    const handleError = (error: any) => {
      console.error("Vapi error:", error);
      toast.error(`Voice error: ${error.message}`);
    };

    // Attach listeners with named functions
    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    return () => {
      // Remove listeners with the same functions
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
      vapi.stop();
    };
  }, []);

  const toggleCall = async () => {
    if (!window.vapi) return;

    if (isCallActive) {
      await window.vapi.stop();
    } else {
      try {
        // Start with existing assistant ID and variable values
        await window.vapi.start(import.meta.env.VITE_VAPI_ASSISTANT_ID, {
          // TODO: Update these later
          variableValues: {
            userId: localStorage.getItem("login"),
            authToken: localStorage.getItem("login"),
            VITE_REACT_APP_BACKEND_URL: import.meta.env
              .VITE_REACT_APP_BACKEND_URL,
          },
        });
      } catch (error) {
        console.error("Failed to start voice assistant:", error);
        toast.error("Failed to start voice assistant");
      }
    }
  };

  return (
    <div>
      <button
        onClick={toggleCall}
        className={`${
          isCallActive ? "animate-pulse text-red-400" : "text-white "
        }`}
      >
        {isCallActive ? "Stop Assistant" : "Start Assistant"}
      </button>
    </div>
  );
};

VapiHandler.defaultProps = {};

export default VapiHandler;
