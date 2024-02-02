import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);

  useEffect(() => {
    if (audioFile) {
      const audioContext = new AudioContext();
      const audioElement = new Audio(audioFile);
      const analyserNode = audioContext.createAnalyser();

      analyserNode.fftSize = 2048;

      const dataArray = new Uint8Array(analyserNode.frequencyBinCount);

      const updateDataArray = () => {
        analyserNode.getByteFrequencyData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        console.log(dataArray);
      };

      audioElement.addEventListener("canplay", () => {
        audioElement.play();
        updateDataArray();
      });

      audioElement.play();
      updateDataArray();

      const sourceNode = audioContext.createMediaElementSource(audioElement);
      sourceNode.connect(analyserNode);
      analyserNode.connect(audioContext.destination);
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
        {[...Array(36)].map((_, index) => (
          <div
            key={index}
            className="cell"
            style={{
              backgroundColor: audioData
                ? `rgba(152, 255, 152, ${audioData[index] / 255})`
                : "rgba(152, 255, 152, 0.1)",
            }}
          />
        ))}
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
