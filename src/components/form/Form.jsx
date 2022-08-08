import FormInput from "./FormInput";
import { useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./form.css";
import { useNavigate } from "react-router-dom";

const URL = "ws://localhost:9090";

const Form = () => {
  const [values, setValues] = useState({
    username: "",
    game_code: "",
    can_join: "",
  });
  const navigate = useNavigate();

  const [clientId, setClientId] = useState([]);
  const [gameId, setGameId] = useState([]);
  const [show, setShow] = useState(false);

  const [inputs, setInputs] = useState([
    {
      id: 1,
      name: "username",
      type: "text",
      placeholder: "enter your username...",
      errorMessage:
        "Username should 1 to 25 characters and shouldn't include any special character!",
      label: "Username: ",
      pattern: "^[A-Za-z0-0]{1,25}$",
      required: true,
    },
  ]);

  const [buttonText, setbtnText] = useState([
    {
      id: 0,
      text: "Next",
      className: "submit",
    },
  ]);

  const [ws, setWs] = useState(new W3CWebSocket(URL));

  useEffect(() => {
    ws.onopen = () => {
      console.log("Successful connection");
    };

    ws.onmessage = (message) => {
      // message.data
      const response = JSON.parse(message.data);
      // Connect player Response
      if (response.method === "connect") {
        let clientId = response.clientId;
        setClientId(clientId);
        console.log(`It's working and your ID is: ${clientId}`);
      }

      if (response.method === "stepOne") {
        if (response.confirmedUsername) {
          setValues({ username: "" });
          console.log("It's working and your username is confirmed");
        }
      }

      if (response.method === "createdGame") {
        if (response.game) {
          let gameId = response.game.id;
          setGameId(gameId);
          console.log(`It's working and your game ID is ${gameId}`);
        }
      }

      if (response.method === "joinGame") {
        if (response.canJoin) {
          console.log(`Did you join the game? ${response.canJoin}`);
          let responseCanJoin = response.canJoin;
          isJoined(responseCanJoin);
        }
      }
    };

    return () => {
      ws.onclose = () => {
        console.log("Connection closed");
        setWs(new WebSocket(URL));
      };
    };
  }, [ws.onmessage, ws.onopen, ws.onclose]);

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      e.currentTarget.elements.username &&
      e.currentTarget.elements.username.value
    ) {
      let newField = {
        id: 1,
        name: "game_code",
        type: "text",
        placeholder: "enter a game code...",
        errorMessage: "Enter a game code of valid format!",
        pattern: "^[a-zA-Z0-9-_]+$",
        label: "Game Code: ",
      };

      let newButtons = [
        {
          id: 0,
          text: "Generate Game Code",
          onclick: onGenerateGameCode,
          className: "generateCode",
        },
        {
          id: 1,
          text: "Join ",
          className: `submit`,
        },
      ];

      let dataBtn = [...buttonText];
      dataBtn.splice(0, 1, ...newButtons);
      setbtnText(dataBtn);

      let data = [...inputs, newField];
      data.splice(0, 1);
      setInputs(data);
      onSubmitUsername(e.currentTarget.elements.username.value);
    } else if (
      e.currentTarget.elements.game_code &&
      e.currentTarget.elements.game_code.value
    ) {
      joinGame(e.currentTarget.elements.game_code.value);
    }
  };

  function isJoined(response) {
    if (response) {
      navigate(`/game/${gameId}/lobby`);
    }
  }

  const onSubmitUsername = (username) => {
    const payLoad = {
      method: "stepOne",
      clientId: clientId,
      clientUsername: username,
    };

    ws.send(JSON.stringify(payLoad));
  };

  const onGenerateGameCode = () => {
    const payLoad = {
      method: "stepTwo",
      clientId: clientId,
    };
    setShow(true);

    ws.send(JSON.stringify(payLoad));
  };

  const joinGame = () => {
    const payLoad = {
      method: "join",
      clientId: clientId,
      gameId: gameId,
    };
    ws.send(JSON.stringify(payLoad));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="TextGame">Join game</h1>
      {inputs.map((input) => (
        <FormInput
          key={input.id}
          {...input}
          value={values[input.name] || ""}
          onChange={(e) => onChange(e)}
        />
      ))}
      {show ? <h6>Your code:</h6> : null}
      <h4>{gameId}</h4>
      {buttonText.map((button) => (
        <button
          key={button.id}
          className={button.className}
          value={values[button.name] || ""}
          onClick={button.onclick}
        >
          {button.text}
        </button>
      ))}
    </form>
  );
};

export default Form;
