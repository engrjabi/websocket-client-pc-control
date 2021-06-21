require("dotenv").config();

const WebSocket = require("ws");
const { spawn } = require("child_process");
const _isString = require("lodash/isString");
const _camelCase = require("lodash/camelCase");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const kill = require("tree-kill");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ processes: {} }).write();

const startWsClient = () => {
  let shouldReconnectOnClose = true;
  let pingTimeout = null;
  let instantiateTimeout = null;

  const ws = new WebSocket( process.env.WS_SERVER_URL, [], {
    headers: {
      token: process.env.SHARED_KEY
    }
  });

  console.log("INSTANTIATE WS", ws.readyState);

  instantiateTimeout = setTimeout(() => {
    console.log("Terminating due to instantiate failure");
    ws.terminate();
    if (shouldReconnectOnClose) {
      shouldReconnectOnClose = false;
      startWsClient();
    }
  }, 10000);

  function heartbeat() {
    console.log("Heartbeat");
    clearTimeout(instantiateTimeout);
    clearTimeout(pingTimeout);

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    pingTimeout = setTimeout(() => {
      console.log("Terminating due to Heartbeat failure");
      ws.terminate();
      if (shouldReconnectOnClose) {
        shouldReconnectOnClose = false;
        startWsClient();
      }
    }, 3000 + 1000);
  }

  ws.on("open", heartbeat);
  ws.on("ping", heartbeat);

  ws.on("message", function incoming(text) {
    console.log("Message Received:", text);

    if (!_isString(text)) {
      return;
    }

    if (text.includes("terminate")) {
      const aliasName = _camelCase(text.replace("terminate", "").trim());
      const existingProcess = db.get(`processes.${aliasName}`).value();

      if (existingProcess && existingProcess.pid) {
        kill(existingProcess.pid);
        return;
      }
    }

    const aliasName = _camelCase(text.trim());
    console.log("Invoke Command:", aliasName);

    const child = spawn(process.env.SHELL, `-i -c ${aliasName}`.split(" "), {
      detached: true,
      stdio: ["ignore", "ignore", "ignore"]
    });
    child.unref();

    db.set(`processes.${aliasName}`, child).write();
  });

  ws.on("close", () => {
    clearTimeout(pingTimeout);
    clearTimeout(instantiateTimeout);
    ws.terminate();
    if (shouldReconnectOnClose) {
      shouldReconnectOnClose = false;
      startWsClient();
    }
  });

  ws.on("error", e => {
    console.log("WS ERROR", e);
    ws.terminate();
  });
};

startWsClient();
