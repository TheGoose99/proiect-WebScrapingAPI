import Playmusic from "./components/audio/playMusic";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div className="container my-4">
        <Playmusic autoplay controls></Playmusic>
      </div>
    </div>
  );
}

export default App;
