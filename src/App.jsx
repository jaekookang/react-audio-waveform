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
    <div className="flex flex-row mx-auto w-full bg-blue-100 justify-center text-center p-4 min-h-screen">
      {/* Main */}
      <main className={`flex flex-col bg-white rounded-md min-w-[${panelMinWidth}px]`}>
        {/* Header */}
        <h1 className="text-4xl p-5 borders">
          Realtime Waveform Visualization
        </h1>

        {/* Control panel */}
        <div className="flex flex-row h-[100px] borders">
          <div className="flex flex-col justify-center borders mx-auto w-[30%] borders">
            <button
              className="flex px-4 py-2 mx-5 rounded-xl justify-center bg-gray-100 borders"
              onClick={toggleRecording}
            >
              {isRecording ? "Pause" : "Play"}
            </button>
          </div>
          <div className="flex flex-col justify-center borders mx-auto w-[70%] borders">
            <div className="flex flex-row borders">
              {/* control: window length */}
              <label htmlFor="windowLength" className="my-auto">
                Waveform Window Length (seconds):
              </label>
              <input
                type="number"
                id="windowLength"
                pattern="[0-9]*"
                className="px-2 py-1 border rounded"
                min="1"
                max="10"
                defaultValue="2"
                placeholder="1-10"
              />
              <button
                className="flex px-4 ml-auto mr-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  let userWindowLength = document.getElementById('windowLength').valueAsNumber;
                  if (userWindowLength < 1 || userWindowLength > 10) { 
                    userWindowLength = 2; // set to default
                  }
                  setWindowLength(userWindowLength);
                }}
              >
                Apply
              </button>
            </div>
            <div className="flex flex-row borders">
              {/* control: sampling rate */}
              <label htmlFor="sampleRate" className="my-auto">
                Sampling rate (hz):
              </label>
              <input
                type="number"
                id="sampleRate"
                pattern="[0-9]*"
                className="px-2 py-1 border rounded"
                min="8000"
                max="44100"
                defaultValue="8000"
                placeholder="8000-44100"
              />
              <button
                className="flex px-4 ml-auto mr-2 my-auto rounded-xl justify-center bg-gray-100 borders transition duration-200 transform hover:scale-100 active:scale-95 active:bg-opacity-70"
                onClick={() => {
                  let userSampleRate = document.getElementById("sampleRate").valueAsNumber;
                  if (userSampleRate < 8000 || userSampleRate > 44100) {
                    userSampleRate = 44100; // set to default
                  }
                  setSampleRate(userSampleRate);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Waveform visualization */}
        <div className="flex min-h-[400px] borders">
          {audioSource ? <Waveform audioSource={audioSource} windowLength={windowLength} frameRate={frameRate} panelMinWidth={panelMinWidth} sampleRate={sampleRate} /> : "no audio"}
        </div>

        {/* Footer */}
        <footer className="borders">footer</footer>
      </main>
    </div>
  );
}
