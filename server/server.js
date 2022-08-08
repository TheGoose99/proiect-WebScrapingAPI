const http = require("http");
const app = require("express")();
app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));
app.listen(9091, () => {
  console.log("Listening on http port 9091");
});
const websocketServer = require("websocket").server;
const httpServer = http.createServer();
httpServer.listen(9090, () => {
  console.log("Listening... on 9090");
});

// Hashmaps:
const clients = {};
const games = {};

const wsServer = new websocketServer({
  httpServer: httpServer,
});

wsServer.on("request", (request) => {
  // TCP connection:
  const connection = request.accept(null, request.origin);

  connection.on("open", () => {
    console.log("opened!");
  });
  connection.on("close", () => {
    console.log("closed!");
  });
  connection.on("message", (message) => {
    // I will assume everyone sends JSON:
    const result = JSON.parse(message.utf8Data);
    console.log(`\n Datele de intrare:`);
    console.log(result);

    if (result.method === "stepOne") {
      const clientId = result.clientId;
      clients[clientId] = {
        connection: connection,
        id: clientId,
        username: result.clientUsername,
        voteReady: false,
      };

      const payLoad = {
        method: "stepOne",
        confirmedUsername: true,
      };

      // We send to the client the game data:
      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    // I have received a message from the client
    // User wants to create a new game:
    if (result.method === "stepTwo") {
      const clientId = result.clientId;
      const gameId = guid();
      games[gameId] = {
        id: gameId,
        clients: [],
      };

      const payLoad = {
        method: "createdGame",
        game: games[gameId],
      };

      console.log("\n Datele de iesire:");
      console.log(payLoad);

      // We send to the client the game data:
      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    // User wants to join a game:
    if (result.method === "join") {
      const clientId = result.clientId;
      const gameId = result.gameId;
      const game = games[gameId];

      // Max players reached.
      if (typeof game.clients !== 'undefined' && game.clients.length >= 3) {
        {
          return;
        }
      }

      game.clients.push({
        clientId: clientId,
      });

      // Start the game:
      if (game.clients.length === 3) {
        updateGameState();
      }

      const payload = {
        method: "joinGame",
        game: game,
        canJoin: true,
      };

      console.log(`Datele de iesire:`);
      console.log(game);

      // Loop through all clients and tell them that people have joined:
      game.clients.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payload));
      });
    }

    // A user plays:
    if (result.method === "play") {
      const gameId = result.gameId;
      const ballId = result.ballId;
      const color = result.color;
      let state = games[gameId].state;

      if (!state) {
        state = {};
      }

      state[ballId] = color;
      games[gameId].state = state;
    }
  });

  // Generate a new client Id:
  const clientId = guid();
  clients[clientId] = {
    connection: connection,
  };

  const payLoad = {
    method: "connect",
    clientId: clientId,
  };

  // Send back the client connect:
  connection.send(JSON.stringify(payLoad));
});

function updateGameState() {
  //{"gameid", fasdfsf}
  for (const g of Object.keys(games)) {
    const game = games[g];
    const payLoad = {
      method: "update",
      game: game,
    };

    game.clients.forEach((c) => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    });
  }

  // Fiecare 500 milisecunde, jocul se va actualiza:
  setTimeout(updateGameState, 500);
}

function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// then to call it, plus stitch in '4' in the third group
const guid = () =>
  (
    S4() +
    S4() +
    "-" +
    S4() +
    "-4" +
    S4().substr(0, 3) +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  ).toLowerCase();
