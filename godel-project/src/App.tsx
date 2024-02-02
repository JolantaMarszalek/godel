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

      analyserNode.fftSize = 2048;

      sourceNode.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      const dataArray = new Uint8Array(analyserNode.fftSize);

      const updateDataArray = () => {
        analyserNode.getByteFrequencyData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        console.log(dataArray);
        // requestAnimationFrame(updateDataArray);
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
        {[...Array(36)].map((_, index) => (
          <div
            key={index}
            className="cell"
            style={{
              backgroundColor: audioData
                ? `rgba(255, 0, 0, ${audioData[index] / 255})`
                : "rgba(255, 0, 0, 0.1)",
            }}
          />
        ))}
      </div>
      <input type="file" onChange={handleFileChange} />
      {audioFile && <audio controls src={audioFile} />}
    </div>
  );
}

export default App;
