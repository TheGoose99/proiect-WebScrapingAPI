import React, { useState, useEffect } from "react";
import url from "../../assets/audio/background-music.mp3";
import "./playMusic.css";

const useAudio = () => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (playing) {
      audio.volume = 0.2;
      audio.currentTime = 0;
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

const Player = ({ url }) => {
  const [playing, toggle] = useAudio(url);

  return (
    <div id="foo">
      <button className="btn btn-warning" onClick={toggle}>
        {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default Player;
