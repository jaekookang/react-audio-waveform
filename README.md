# React Audio Waveform

- Reference:
    - https://github.com/philnash/react-web-audio (blog: https://www.twilio.com/blog/audio-visualisation-web-audio-api--react)

---
- 2024-12-10 jkang first created
- 2024-12-11 Waveform.jsx working
    - Sampling rate: 48000, Frequency bins: 2024, Time domain: 1024 samples => window size: 2048, roughly 42.6 ms
- 2024-12-12 Visualizer.jsx working (using cursor ai)
- 2024-12-16 sampling rate
    - issue: incompatiblity between Uint8Array and Float32Array => needs fixing