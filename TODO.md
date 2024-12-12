# TODOs

- [ ] update Visualizer.jsx to update multiple samples at once for efficiency such as:
    ```javascript
    export default function Visualizer({ audioData }) {
    const canvasRef = useRef(null);
    const bufferRef = useRef({
        data: new Uint8Array(200).fill(128),
        position: 0
    });

    useEffect(() => {
        const buffer = bufferRef.current;
        const bufferLength = buffer.data.length;
        
        // Process multiple samples at once
        const samplesToProcess = Math.min(audioData.length, bufferLength);
        
        if (buffer.position + samplesToProcess <= bufferLength) {
        // If we can fit the new data without wrapping
        buffer.data.set(audioData.subarray(0, samplesToProcess), buffer.position);
        } else {
        // Handle wrap-around case
        const firstChunkSize = bufferLength - buffer.position;
        buffer.data.set(audioData.subarray(0, firstChunkSize), buffer.position);
        buffer.data.set(audioData.subarray(firstChunkSize, samplesToProcess), 0);
        }
        
        buffer.position = (buffer.position + samplesToProcess) % bufferLength;
        
        drawWaveform();
    }, [audioData]);
    ```
