import React, { useState, useEffect, useRef } from "react";
import Visualizer from "./Visualizer";

export default function Waveform({
  audioSource,
  windowLength,
  frameRate,
  panelMinWidth,
  panelMinHeight,
  sampleRate,
}) {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIdRef = useRef(null);

  const resampleAudioData = (audioData, originalSampleRate, targetSampleRate) => {
    const originalLength = audioData.length;
    const targetLength = Math.round(originalLength * targetSampleRate/originalSampleRate);
    const resampledData = new Float32Array(targetLength);

    for (let i=0; i<targetLength; i++) {
      const t = i * (originalLength - 1) / (targetLength - 1);
      const index = Math.floor(t);
      const frac = t - index;
      const value = (1 - frac) * audioData[index] + frac * audioData[index + 1];
      resampledData[i] = value;
    }

    return new Uint8Array(resampledData.buffer);
  }

  useEffect(() => {
    // Initialize AudioContext, Analyser and MediaStreamSource
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext({ sampleRate });
    const analyser = audioContext.createAnalyser();
    // analyser.fftSize = 2048; // default=2048; can change the size of FFT manually if necessary
    const dataArray = new Uint8Array(analyser.frequencyBinCount); // length=1024; half of fftSize
    const source = audioContext.createMediaStreamSource(audioSource);

    source.connect(analyser);

    // Store references to AudioContext, Analyser and MediaStreamSource
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    sourceRef.current = source;

    // Define tick function for animation frame (callback)
    const tick = (time) => {
      // const deltaTime = time - lastTime;
      // lastTime = time;
      // const framerate = 1000 / deltaTime; // in frames per second
      analyser.getByteTimeDomainData(dataArray);
      // Update only when sampling rate differs
      if (!audioContext.sampleRate === sampleRate) {
        const resampledData = resampleAudioData(dataArray, audioContext.sampleRate, sampleRate);
        setAudioData(resampledData);
      } else {
        setAudioData(new Uint8Array(dataArray));
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    // Start animation loop; runs 60 times per second (60fps)
    rafIdRef.current = requestAnimationFrame(tick);

    // // Log sampling rate
    // console.log(audioContext.sampleRate);

    // Clean up on component unmount
    return () => {
      cancelAnimationFrame(rafIdRef.current);
      analyser.disconnect();
      source.disconnect();
      audioContext.close();
    };
  }, [audioSource, windowLength, frameRate, sampleRate]);

  return (
    <div>
      <Visualizer
        audioData={audioData}
        windowLength={windowLength}
        frameRate={frameRate}
        panelMinWidth={panelMinWidth}
        panelMinHeight={panelMinHeight}
        sampleRate={sampleRate}
      />
    </div>
  );
}
