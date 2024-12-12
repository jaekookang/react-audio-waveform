import React, { useEffect, useRef } from 'react'

/** 
 * @param {Uint8Array} audioData - The audio data to visualize.
*/
export default function Visualizer({ audioData }) {
  const canvasRef = useRef(null);
  const bufferRef = useRef(new Array(200).fill(128));

  useEffect(() => {
    // Update buffer with new data
    const newBuffer = bufferRef.current;
    newBuffer.push(audioData[0]);
    newBuffer.shift();
    bufferRef.current = newBuffer;

    drawWaveform();
  }, [audioData]);

  const drawWaveform = () => {
    const canvas = canvasRef.current; // get canvas element
    const ctx = canvas.getContext("2d"); // get canvas context
    const buffer = bufferRef.current; // get buffer

    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.beginPath();

    buffer.forEach((value, index) => {
      const x = (index / buffer.length) * canvas.width;
      const y = (value / 255) * canvas.height;

      if (index === 0) {
        ctx.moveTo(x, y); // sets the starting point
      } else {
        ctx.lineTo(x, y); // draws to the next point
      }
    });

    ctx.stroke();
  };


  return (
    <canvas 
      ref={canvasRef}
      width={800}
      height={200}
      style={{ border: "1px solid black" }}
    />
  )
}
