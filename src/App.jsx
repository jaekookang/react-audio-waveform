/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Waveform from "./components/Waveform";

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioSource, setAudioSource] = useState(null);
  const [windowLength, setWindowLength] = useState(2);
  const [sampleRate, setSampleRate] = useState(44100);
  const frameRate = 60; // assume 60fps
  const panelMinWidth = 800;
  const panelMinHeight = 400;
  const windowLenSmall = 1;
  const windowLenMedium = 2;
  const windowLenLarge = 3;

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioSource(stream);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      if (err.name === "NotFoundError") {
        alert("No microphone found");
      } else if (err.name === "NotAllowedError") {
        alert("Access to microphone is not allowed");
      } else if (err.name === "NotSupportedError") {
        alert("getUserMedia is not supported by your browser; try on the desktop browser");
      } else {
        alert("An unexpected error occurred: " + err.message);
      }
    }
  }

  function stopRecording() {
    audioSource?.getTracks().forEach((track) => track.stop());
    setAudioSource(null);
    setIsRecording(false);
  }

  function toggleRecording() {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  return (
    // Screen
    <div
      className={`flex flex-row w-full bg-blue-100 justify-center text-center p-4 h-screen items-center min-w-[800px] borders`}
    >
      {/* Main */}
      <main
        className={`flex flex-col bg-white rounded-md min-w-[800px]`}
      >
        {/* Header */}
        <h1 className="text-4xl p-5 borders">
          Realtime Waveform Visualization
        </h1>

        {/* Control panel */}
        <div className="flex flex-row h-[100px] borders">
          <div className="flex flex-col justify-center borders mx-auto w-[30%] borders">
            <button
              className={`flex px-4 py-2 mx-5 rounded-xl justify-center bg-gray-100 borders ${
                isRecording ? "bg-red-100" : "bg-blue-100"
              }`}
              onClick={toggleRecording}
            >
              {isRecording ? "Pause" : "Play"}
            </button>
          </div>
          <div className="flex flex-col justify-center borders mx-auto w-[70%] borders my-auto">
            <div className="flex flex-row borders my-1">
              {/* control: window length */}
              <label htmlFor="windowLength" className="my-auto mx-auto">
                Waveform Window Length:
              </label>
              <button
                className="flex px-4 mx-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  setWindowLength(windowLenSmall);
                  console.log("'Small' window selected");
                }}
              >
                Small
              </button>
              <button
                className="flex px-4 mx-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  setWindowLength(windowLenMedium);
                  console.log("'Medium' window selected");
                }}
              >
                Medium
              </button>
              <button
                className="flex px-4 mx-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  setWindowLength(windowLenLarge);
                  console.log("'Large' window selected");
                }}
              >
                Large
              </button>
            </div>
            <div className="flex flex-row borders my-1">
              {/* control: sampling rate */}
              <label htmlFor="sampleRate" className="my-auto mx-auto">
                Sampling rate (hz):
              </label>
              <button
                className="flex px-4 mx-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  setSampleRate(16000);
                  console.log("sampleRate=16000 selected");
                }}
              >
                16000
              </button>
              <button
                className="flex px-4 mx-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  setSampleRate(22050);
                  console.log("sampleRate=22050 selected");
                }}
              >
                22050
              </button>
              <button
                className="flex px-4 mx-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  setSampleRate(44100);
                  console.log("sampleRate=44100 selected");
                }}
              >
                44100
              </button>
            </div>
          </div>
        </div>

        {/* Waveform visualization */}
        <div
          className={`flex items-center justify-center min-h-[400px] my-1 bg-gray-100`}
        >
          {audioSource ? (
            <Waveform
              audioSource={audioSource}
              windowLength={windowLength}
              frameRate={frameRate}
              panelMinWidth={panelMinWidth}
              panelMinHeight={panelMinHeight}
              sampleRate={sampleRate}
            />
          ) : (
            <div className="text-center">Press Play button to start</div>
          )}
        </div>

        {/* Footer */}
        <footer className="borders my-2">
          Jaekoo Kang
        </footer>
      </main>
    </div>
  );
}
