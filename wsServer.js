var { Server } = require("ws");

global.wssWithId = {};

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const createWsServer = () => {
  const wss = new Server({ noServer: true });

  wss.on("connection", (ws, req) => {
    console.log("Client connected");

    ws.isAlive = true;
    ws.on("pong", heartbeat);
    ws.on("close", () => console.log("Client disconnected"));

    if (req && req.headers && req.headers.id) {
      global.wssWithId[req.headers.id] = ws;
    }
  });

  setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 60000);

  global.wss = wss;
  return wss;
};

module.exports = createWsServer;
