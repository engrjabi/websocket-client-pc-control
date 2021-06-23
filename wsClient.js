require("dotenv").config();

const WebSocket = require("ws");
const _isString = require("lodash/isString");
const isEmpty = require("lodash/isEmpty");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const openKillAppIntent = require("./wsClientIntents/openKillAppIntent");
const screenShotIntent = require("./wsClientIntents/screenShotIntent");
const powerControlsIntent = require("./wsClientIntents/powerControlsIntent");

const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ processes: {} }).write();

const startWsClient = () => {
  let shouldReconnectOnClose = true;
  let pingTimeout = null;
  let instantiateTimeout = null;

  const ws = new WebSocket(process.env.WS_SERVER_URL, [], {
    headers: {
      token: process.env.SHARED_KEY,
      id: process.env.DEVICE_ID
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
    }, 60000 + 1000);
  }

  ws.on("open", heartbeat);
  ws.on("ping", heartbeat);

  ws.on("message", function incoming(text) {
    let messageInput = null;
    console.log("Message Received:", text);

    if (!_isString(text)) {
      return;
    }

    try {
      messageInput = JSON.parse(text);
    } catch (e) {
      console.log(e);
      messageInput = null;
    }

    if (isEmpty(messageInput)) {
      return;
    }

    openKillAppIntent(messageInput, db);
    screenShotIntent(messageInput, db);
    powerControlsIntent(messageInput, db);
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
