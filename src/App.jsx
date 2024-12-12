/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Waveform from "./components/Waveform";

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioSource, setAudioSource] = useState(null);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioSource(stream);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  }

  function stopRecording() {
    audioSource?.getTracks().forEach(track => track.stop());
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
    <div className="flex flex-row mx-auto w-full bg-blue-100 justify-center text-center p-4 min-h-screen">
      {/* Main */}
      <main className="flex flex-col bg-white rounded-md min-w-[800px]">
        {/* Header */}
        <h1 className="text-4xl p-5 borders">
          Realtime Waveform Visualization
        </h1>

        {/* Control panel */}
        <div className="flex flex-row h-[100px] borders">
          <div className="flex flex-col justify-center borders mx-auto w-[30%] borders">
            <button className="flex px-4 py-2 mx-5 rounded-xl justify-center bg-gray-100 borders" onClick={toggleRecording}>
              {isRecording ? "Pause" : "Play"}
            </button>
          </div>
          <div className="flex flex-col justify-center borders mx-auto w-[70%] borders">
            <div className="flex flex-col borders">controller</div>
          </div>
        </div>

        {/* Waveform visualization */}
        <div className="flex min-h-[400px] borders">
          {audioSource ? <Waveform audioSource={audioSource} /> : "no audio"}
        </div>

        {/* Footer */}
        <footer className="borders">footer</footer>
      </main>
    </div>
  );
}
