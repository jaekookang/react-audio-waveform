import React, { useEffect, useRef } from 'react'


export default function Visualizer({ audioData, windowLength, frameRate, panelMinWidth, panelMinHeight, sampleRate }) {
  const canvasRef = useRef(null);
  const bufferRef = useRef(new Uint8Array(1024 * windowLength * frameRate).fill(128));

  // Update buffer size dynamically
  useEffect(() => {
    bufferRef.current = new Uint8Array(1024 * windowLength * frameRate).fill(128);
  }, [windowLength, frameRate]);

  // Update buffer with new audio data
  useEffect(() => {
    const updateBuffer = async () => {
      const newBuffer = bufferRef.current;
      const newData = audioData.slice(-newBuffer.length);
      const updatedBuffer = new Uint8Array(newBuffer.length);
      
      updatedBuffer.set(newBuffer.slice(newData.length));
      updatedBuffer.set(newData, newBuffer.length - newData.length);  

      bufferRef.current = updatedBuffer;

      drawWaveform();
    }
    
    updateBuffer();
  }, [audioData, sampleRate]);

  const drawWaveform = () => {
    const canvas = canvasRef.current; // get canvas element
    const ctx = canvas.getContext("2d"); // get canvas context
    const buffer = bufferRef.current; // get buffer
    canvas.width = panelMinWidth;
    canvas.height = panelMinHeight;

    ctx.fillStyle = "rgba(200, 200, 200, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();

    buffer.forEach((value, index) => {
      const x = (index / buffer.length) * canvas.width;
      const y = (value / 255) * canvas.height;

      if (index === 0) {
        ctx.moveTo(x, y); // sets the starting point
      } else {
        ctx.lineTo(x, y); // draws to the next point
      }

      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fill();
    });

    ctx.stroke();
  };

  return (
    <canvas 
      ref={canvasRef}
      width={panelMinWidth}
      height={200}
      // style={{ border: "1px solid black" }}
    />
  )
}
