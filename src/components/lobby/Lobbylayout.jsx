import { useEffect, useState } from "react";
import { BsXCircleFill, BsFillCheckCircleFill } from "react-icons/bs";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Header from "../UI/header";
import "./lobbyLayout.css";

const URL = "ws://localhost:9090";

const Lobbylayout = (props) => {
  const [gameData, setGameData] = useState(props[1]);
  const clientId = props[0];
  let ReadyPlayers = 0;

  const startGame = () => {
    if (ReadyPlayers === gameData.clients.length) {
      console.log("Everybody is ready");
    }
  };

  const leaveGame = () => {
    console.log("Leaving...");
  };

  let buttonText = [
    {
      key: 0,
      text: "Start Game",
      onclick: startGame,
      className: "btn btn-success startGame",
    },
    {
      id: 1,
      text: "Leave",
      className: "btn btn-danger leaveLobby",
      onclick: leaveGame,
    },
  ];

  const [ws, setWs] = useState(new W3CWebSocket(URL));

  useEffect(() => {
    ws.onopen = () => {
      console.log("Successful connection");
    };

    ws.onmessage = (message) => {
      // message.data
      const response = JSON.parse(message.data);

      //update
      if (response.method === "changeVote") {
        console.log("Am primit raspuns. Multumesc");
      }
    };

    return () => {
      ws.onclose = () => {
        console.log("Connection closed");
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose]);

  const toggleReady = (c) => {
    const newGameData = { ...gameData };
    newGameData.clients[c].voteReady = !newGameData.clients[c].voteReady;
    setGameData(newGameData);
    clientChangeVote(c);
  };

  const clientChangeVote = (c) => {
    const payLoad = {
      method: "test",
      clientId: gameData.clients[c].id,
      gameId: gameData.id,
    };
    console.log(payLoad);
    ws.send(JSON.stringify(payLoad));
  };

  return (
    <div>
      <Header name="Waiting Room" />
      <div className="centered">
        {buttonText.map((button) => (
          <button
            key={button.id}
            className={button.className}
            value={button.name}
            onClick={button.onclick}
          >
            {button.text}
          </button>
        ))}
        <div className="players">
          <h1>Lobby players:</h1>
          {gameData.clients.map((c, index) => (
            <div>
              <div>
                <h2 key={c.id}>
                  Player {index + 1}: {c.username}
                </h2>
                {c.voteReady === true ? (
                  <BsFillCheckCircleFill className="mark" />
                ) : (
                  <BsXCircleFill className="cross" />
                )}
                {c.id === clientId ? (
                  <button
                    className="btn btn-info btn-sm button-ready"
                    onClick={() => toggleReady(index)}
                  >
                    Ready?
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lobbylayout;
