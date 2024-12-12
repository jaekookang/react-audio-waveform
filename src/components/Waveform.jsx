import React, { useState, useEffect, useRef } from "react";
import Visualizer from "./Visualizer";

export default function Waveform({ audioSource }) {
  const [audioData, setAudioData] = useState(new Uint8Array(0));
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    // Initialize AudioContext, Analyser and MediaStreamSource
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    // analyser.fftSize = 2048; // default=2048; can change the size of FFT manually if necessary
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const source = audioContext.createMediaStreamSource(audioSource);

    source.connect(analyser);

    // Store references to AudioContext, Analyser and MediaStreamSource
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;
    sourceRef.current = source;

    // Define tick function for animation frame (callback)
    const tick = () => {
        analyser.getByteTimeDomainData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        rafIdRef.current = requestAnimationFrame(tick);
        // console.log(dataArray); // check realtime data
    }

    // Start animation loop
    rafIdRef.current = requestAnimationFrame(tick);

    // Log sampling rate
    console.log(audioContext.sampleRate);  

    // Clean up on component unmount
    return () => {
        cancelAnimationFrame(rafIdRef.current);
        analyser.disconnect();
        source.disconnect();
        audioContext.close();
    };
  }, [audioSource]);

  return (
  <div>
    <Visualizer audioData={audioData} />
  </div>
);
}
