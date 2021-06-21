var { Server } = require("ws");

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

const createWsServer = () => {
  const wss = new Server({ noServer: true });

  wss.on("connection", ws => {
    console.log("Client connected");
    ws.isAlive = true;
    ws.on("pong", heartbeat);
    ws.on("close", () => console.log("Client disconnected"));
  });

  setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();

      ws.isAlive = false;
      ws.ping(noop);
    });
  }, 120000);

  global.wss = wss;
  return wss;
};

module.exports = createWsServer;
