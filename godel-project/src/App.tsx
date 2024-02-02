import { useState } from "react";
import "./App.css";

function App() {
  const [audioFile, setAudioFile] = useState<string | null>(null);

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
          <div key={index} className="cell" />
        ))}
      </div>{" "}
      {audioFile && <audio controls src={audioFile} />}
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default App;
