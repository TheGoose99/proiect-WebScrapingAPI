import { useLocation } from "react-router-dom";
import { useState } from "react";
import LobbyLayout from "../components/lobby/Lobbylayout";
const Lobby = () => {
  const location = useLocation();
  const [yourId, setyourId] = useState(location.state.clientId);
  const [sentGameData, setsentGameData] = useState(location.state.gameData);
  const sentData = [yourId, sentGameData];
  return <LobbyLayout {...sentData}></LobbyLayout>;
};

export default Lobby;
