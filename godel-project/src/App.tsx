import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array>(
    new Uint8Array(36).fill(0)
  );

  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let audioElement: HTMLAudioElement | null = null;
    let analyserNode: AnalyserNode | null = null;

    const updateDataArray = () => {
      if (analyserNode) {
        const dataArray = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteFrequencyData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        animationFrameIdRef.current = requestAnimationFrame(updateDataArray);
      }
    };

    const handleCanPlay = () => {
      if (audioElement) {
        audioElement.play();
        animationFrameIdRef.current = requestAnimationFrame(updateDataArray);
      }
    };

    if (audioFile) {
      audioContext = new AudioContext();
      audioElement = new Audio(audioFile);
      analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 256;

      const sourceNode = audioContext.createMediaElementSource(audioElement);
      sourceNode.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      audioElement.addEventListener("canplay", handleCanPlay);

      return () => {
        if (audioElement) {
          audioElement.removeEventListener("canplay", handleCanPlay);
          audioElement.pause();
        }
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
          animationFrameIdRef.current = null;
        }
        if (audioContext) {
          audioContext.close();
          audioContext = null;
        }
      };
    }
  }, [audioFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setAudioFile(URL.createObjectURL(files[0]));
    }
  };

  return (
    <div className="App">
      <div className="gridContainer">
        {audioData &&
          Array.from(audioData)
            .map((value, index) => {
              const invertedValue = 255 - value;
              return (
                <div
                  key={index}
                  className="cell"
                  style={{
                    backgroundColor:
                      // invertedValue > 128
                      // ?
                      `rgba(0, 100, 0, ${invertedValue / 255})`,
                    // : "rgba(255, 255, 255, 1)",
                  }}
                />
              );
            })
            .slice(0, 36)}
      </div>
      <div style={{ margin: "10px" }}>
        {audioFile && <audio controls src={audioFile} />}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        style={{ margin: "10px" }}
      />
    </div>
  );
}

export default App;
