import { useEffect, useState } from "react";
// import ReactAudioAnalyser from "react-audio-analyser";
import "./App.css";

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (audioFile) {
      const audioContext = new AudioContext();
      const audioElement = new Audio(audioFile);
      const analyserNode = audioContext.createAnalyser();
      const sourceNode = audioContext.createMediaElementSource(audioElement);

      sourceNode.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyserNode.fftSize);

      const updateDataArray = () => {
        analyserNode.getByteFrequencyData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        requestAnimationFrame(updateDataArray);
      };

      audioElement.play();
      updateDataArray();
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
            .map((value, index) => (
              <div
                key={index}
                className="cell"
                style={{ height: `${value}px`, backgroundColor: "red" }}
              />
            ))
            .slice(0, 36)}{" "}
      </div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default App;
